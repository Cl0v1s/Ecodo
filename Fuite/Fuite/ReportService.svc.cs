using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;
using System.Web.Security;
using System.ServiceModel.Channels;
using System.Net;
using System.Web;
using System.IO;
using System.Data.Entity;

namespace FuiteAPI
{
    public class ReportService : IReportService
    {

        /// <summary>
        /// Ajoute les headers CORS à une réponse afin de permettre l'accès depuis n'importe  où sur Internet
        /// </summary>
        /// <returns>False si requête OPTIONS, true sinon</returns>
        private bool AddCORS()
        {
            WebOperationContext.Current.OutgoingResponse.Headers.Add("Access-Control-Allow-Origin", "*");
            if (WebOperationContext.Current.IncomingRequest.Method == "OPTIONS")
            {
                WebOperationContext.Current.OutgoingResponse.Headers.Add("Access-Control-Allow-Methods", "POST, GET");
                WebOperationContext.Current.OutgoingResponse.Headers.Add("Access-Control-Allow-Headers", "Content-Type, Accept");
                return false;
            }
            return true;
        }

        /// <summary>
        /// Calcule la distance en mètres entre deux points géodésiques
        /// </summary>
        /// <param name="lat1">Latitude du point 1</param>
        /// <param name="lon1">Longitude du point 1</param>
        /// <param name="lat2">Latitude du point 2</param>
        /// <param name="lon2">Longitude du point 2</param>
        /// <returns></returns>
        private static double DistanceGeo(double lat1, double lon1, double lat2, double lon2)
        {
            var R = 6371e3; // metres
            var φ1 = Math.PI / 180 * lat1;
            var φ2 = Math.PI / 180 * lat2;
            var Δφ = Math.PI / 180 * (lat2 - lat1);
            var Δλ = Math.PI / 180 * (lon2 - lon1);

            var a = Math.Sin(Δφ / 2) * Math.Sin(Δφ / 2) +
                    Math.Cos(φ1) * Math.Cos(φ2) *
                    Math.Sin(Δλ / 2) * Math.Sin(Δλ / 2);
            var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));

            return R * c;
        }


        public Result AddReport(ReportRequest report)
        {
            if (this.AddCORS() == false)
                return null;
            Result r = new Result();
            try
            {
                if (report == null || report.Id != null)
                    throw new ArgumentException("Vous devez préciser un rapport de fuite ne disposant pas d'ID.");
                FuiteKey entities = new FuiteKey();
                OperationContext context = OperationContext.Current;
                MessageProperties prop = context.IncomingMessageProperties;
                RemoteEndpointMessageProperty endpoint =
                       prop[RemoteEndpointMessageProperty.Name] as RemoteEndpointMessageProperty;
                string ip = endpoint.Address;

                report.Ip = ip;
                report.Date = DateTime.Now;
                Picture picture;
                Report[] reports = entities.Reports.Where(x => x.state != (int)State.Closed && DbFunctions.DiffDays(report.Date, x.date) < 1
                ).ToArray();
                List<Report> existing = new List<Report>();
                for(int i = 0; i < reports.Length; i++)
                {
                    Report x = reports[i];
                    if (x == null)
                        continue;
                    if(DistanceGeo((double)report.Latitude, (double)report.Longitude, x.latitude, x.longitude) <= int.Parse(System.Configuration.ConfigurationManager.AppSettings["Distance"]))
                    {
                        existing.Add(x);
                    }
                }
                if (existing.Count() > 0)
                {
                    foreach(Report re in existing)
                    {
                        re.quantity += 1;
                        picture = new Picture();
                        picture.date = DateTime.Now;
                        picture.ip = ip;
                        picture.Report_id = re.id;
                        picture.data = report.Picture;
                        entities.Pictures.Add(picture);
                    }
                    entities.SaveChanges();
                    r.Message = "Votre photo a été ajoutée à un signalement déjà existant. Merci Beaucoup !";
                    return r;
                }

                if (report.IsValid() == false)
                    throw new ArgumentException("Vous devez préciser un rapport de fuite complet.");
                Report res = report.Report;
                res.quantity = 1;
                entities.Reports.Add(res);
                entities.SaveChanges();

                Change change = new Change();
                change.Report_id = res.id;
                change.state = (int)State.New;
                entities.Changes.Add(change);

                picture = new Picture();
                picture.Report_id = res.id;
                picture.data = report.Picture;
                picture.date = DateTime.Now;
                picture.ip = ip;
                entities.Pictures.Add(picture);

                entities.SaveChanges();
                r.Message = "Votre signalement a bien été enregistré ! Merci beaucoup !";

            }
            catch(Exception e)
            {
                r.Code = 1;
                r.Message = e.Message;
                while(e.InnerException != null)
                {
                    r.Message += "<br>" + e.InnerException.Message;
                    e = e.InnerException;
                }
            }
            return r;
        }

        

        public Result SetReport(SetReportRequest request)
        {
            if (this.AddCORS() == false)
                return null;

            string ticket = request.ticket;
            ReportRequest report = request.report;

            Result re = new Result();
            try
            {
                WebSrvPortal.Auth.User user = Auth.WithTicket(ticket);
                if (user == null)
                {
                    re.Code = 2;
                    throw new ArgumentException("Vous devez être identifié pour réaliser cette tâche.");
                }
                if (report == null || report.Id == null)
                {
                    re.Code = 1;
                    throw new ArgumentException("Vous devez préciser un rapport de fuite disposant d'un ID.");
                }
                FuiteKey entities = new FuiteKey();
                Report[] reports = entities.Reports.Where(x => x.id == report.Id).ToArray();
                if (reports.Length <= 0)
                    throw new ArgumentOutOfRangeException();
                Report r = reports[0];
                if (report.Ip != null)
                    r.ip = report.Ip;
                if (report.Latitude != null)
                    r.latitude = (int)report.Latitude;
                if (report.Longitude != null)
                    r.longitude = (int)report.Longitude;
                if (report.State < State.All)
                    r.state = (int)report.State;
                if (report.Description != null)
                    r.description = report.Description;

                Change change = new Change();
                change.Report_id = r.id;
                change.state = r.state;
                change.date = DateTime.Now;
                change.Operator_id = user.IdUser;

                entities.Changes.Add(change);

                entities.SaveChanges();
               
            }
            catch(Exception e)
            {
                if (re.Code == 0)
                    re.Code = -1;
                re.Message = e.Message;
            }
            return re;
        }

        public ResultReports GetReport(GetReportRequest request)
        {
            if (this.AddCORS() == false)
                return null;
            string ticket = request.ticket;
            int id = request.id;
            ResultReports r = new ResultReports();
            try
            {
                if (Auth.WithTicket(ticket) == null)
                    throw new ArgumentException("Vous devez être identifié pour réaliser cette tâche.");
                FuiteKey entities = new FuiteKey();
                Report[] reports = entities.Reports.Where(x => x.id == id).ToArray();
                if (reports.Length <= 0)
                    throw new ArgumentOutOfRangeException();
                ReportRequest report = new ReportRequest(reports[0]);
                if (report.Date <= DateTime.MinValue || report.Date >= DateTime.MaxValue)
                    report.Date = DateTime.Now;

                r.Data = new ReportRequest[] { report };
            }
            catch(Exception e)
            {
                r.Code = 1;
                r.Message = e.Message;
            }
            return r;
        }

        public ResultReports GetReports(GetReportsRequest request)
        {
            if (this.AddCORS() == false)
                return null;
            string ticket = request.ticket;
            State state = request.state;
            int minIndex = request.minIndex;
            int maxIndex = request.maxIndex;

            ResultReports re = new ResultReports();
            try
            {
                if (Auth.WithTicket(ticket) == null)
                {
                    re.Code = 2;
                    throw new ArgumentException("Vous devez être identifié pour réaliser cette tâche.");
                }
                FuiteKey entities = new FuiteKey();
                Report[] reports = entities.Reports.Where(x => x.state == (int)state && x.id >= minIndex && x.id <= maxIndex).ToArray();
                List<ReportRequest> results = new List<ReportRequest>();
                foreach (Report r in reports)
                {
                    ReportRequest rep = new ReportRequest(r);
                    rep.Picture = "";
                    if (rep.Date >= DateTime.MaxValue || rep.Date <= DateTime.MinValue)
                        rep.Date = DateTime.Now;
                    results.Add(rep);
                }
                re.Data = results.ToArray();
            }
            catch(Exception e)
            {
                if (re.Code == 0)
                    re.Code = -1;
                re.Message = e.Message;
            }
            return re;
        }

        public ResultPictures GetPictures(GetPicturesRequest request)
        {
            if (this.AddCORS() == false)
                return null;
            string ticket = request.ticket;
            int reportid = request.reportId;
            ResultPictures re = new ResultPictures();
            try
            {
                if (Auth.WithTicket(ticket) == null)
                {
                    re.Code = 2;
                    throw new ArgumentException("Vous devez être identifié pour réaliser cette tâche.");
                }
                FuiteKey entities = new FuiteKey();
                Picture[] pictures = entities.Pictures.Where(x => x.Report_id == reportid).ToArray();

                re.Data = pictures;
            }
            catch (Exception e)
            {
                if (re.Code == 0)
                    re.Code = -1;
                re.Message = e.Message;
            }
            return re;
        }

        public ResultChanges GetChanges(GetChangesRequest request)
        {
            if (this.AddCORS() == false)
                return null;
            string ticket = request.ticket;
            int reportid = request.reportId;
            ResultChanges re = new ResultChanges();
            try
            {
                if (Auth.WithTicket(ticket) == null)
                {
                    re.Code = 2;
                    throw new ArgumentException("Vous devez être identifié pour réaliser cette tâche.");
                }
                FuiteKey entities = new FuiteKey();
                Change[] changes = entities.Changes.Where(x => x.Report_id == reportid).ToArray();
                foreach(Change c in changes)
                {
                    if (c.date <= DateTime.MinValue || c.date >= DateTime.MaxValue)
                        c.date = DateTime.Now;
                }

                re.Data = changes;
            }
            catch (Exception e)
            {
                if (re.Code == 0)
                    re.Code = -1;
                re.Message = e.Message;
            }
            return re;
        }

        public Result RemoveContentIp(RemoveContentIpRequest request)
        {
            Result result = new Result();
            try
            {
                if (request.ip == null || String.IsNullOrWhiteSpace(request.ip))
                {
                    if (request.picture)
                        this.RemovePicture(request.id);
                    if (request.report)
                        this.RemoveReport(request.id);
                }
                else
                {
                    if (request.picture)
                        this.RemovePictures(request.ip);
                    if (request.report)
                        this.RemoveReports(request.ip);
                }
            }
            catch(Exception e)
            {
                if (result.Code == 0)
                    result.Code = -1;
                result.Message = e.Message;
            }

            return result;
        }

        /// <summary>
        /// Supprime une photographie en fonction de son ID
        /// </summary>
        /// <param name="id">ID de la photo à supprimer</param>
        private void RemovePicture(int id)
        {
            FuiteKey entities = new FuiteKey();
            Picture pic = entities.Pictures.Where(x => x.id == id).FirstOrDefault();
            if (pic == null)
                return;
            entities.Pictures.Remove(pic);
            entities.SaveChanges();
        }

        /// <summary>
        /// Supprime un report en fonction de son ID
        /// </summary>
        /// <param name="id">ID du report à supprimer</param>
        private void RemoveReport(int id)
        {
            FuiteKey entities = new FuiteKey();
            Report pic = entities.Reports.Where(x => x.id == id).FirstOrDefault();
            if (pic == null)
                return;
            entities.Reports.Remove(pic);
            entities.SaveChanges();
        }

        /// <summary>
        /// Supprime des photographies en fonction de l'adresse IP de l'utilisateur les ayant envoyé
        /// </summary>
        /// <param name="ip">IP des photographies à supprimer</param>
        private void RemovePictures(string ip)
        {
            FuiteKey entities = new FuiteKey();
            IQueryable<Picture> pic = entities.Pictures.Where(x => x.ip == ip && DbFunctions.DiffDays(DateTime.Now, x.date) <= 1);
            entities.Pictures.RemoveRange(pic);
            entities.SaveChanges();
        }

        /// <summary>
        /// Supprime des reports en fonction de l'adresse IP de l'utilisateur les ayant envoyé
        /// </summary>
        /// <param name="ip">IP des reports à supprimer</param>
        private void RemoveReports(string ip)
        {
            FuiteKey entities = new FuiteKey();
            IQueryable<Report> pic = entities.Reports.Where(x => x.ip == ip && DbFunctions.DiffDays(DateTime.Now, x.date) <= 1);
            entities.Reports.RemoveRange(pic);
            entities.SaveChanges();
        }

        
    }
}
