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

namespace FuiteAPI
{
    public class ReportService : IReportService
    {

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

        public Result AddReport(ReportContract report)
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

                if (entities.Bans.Where(x => x.ip == ip).Count() > 0)
                    throw new Exception("Vous ne pouvez plus publier de signalements.");

                report.Ip = ip;
                if (report.IsValid() == false)
                    throw new ArgumentException("Vous devez préciser un rapport de fuite complet.");
                Report res = report.Report;
                entities.Reports.Add(res);
                entities.SaveChanges();

                Change change = new Change();
                change.Report_id = res.id;
                change.state = (int)State.New;
                entities.Changes.Add(change);
                entities.SaveChanges();

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

        public void UploadPicture(string fileName, Stream stream)
        {
            if (this.AddCORS() == false)
                return ;
            string pFileName = "picture";
            Result r = new Result();
            if(stream == null ||stream.Length <=0 )
            {
                r.Code = 3;
                r.Message = "Le nom de fichier ne peut être vide.";
                return;
            }
            FileStream fileStream = null;
            //Get the file upload path store in web services web.config file.  
            string strTempFolderPath = System.Configuration.ConfigurationManager.AppSettings.Get("FileUploadPath");
            try
            {

                if (!string.IsNullOrEmpty(strTempFolderPath))
                {
                    if (!string.IsNullOrEmpty(pFileName))
                    {
                        string strFileFullPath = strTempFolderPath + pFileName;
                        fileStream = new FileStream(strFileFullPath, FileMode.OpenOrCreate, FileAccess.ReadWrite);
                        // write file stream into the specified file  
                        using (System.IO.FileStream fs = fileStream)
                        {
                            int readCount;
                            var buffer = new byte[8192];
                            while ((readCount = stream.Read(buffer, 0, buffer.Length)) != 0)
                            {
                                fs.Write(buffer, 0, readCount);
                            }
                        }
                    }
                    else
                    {
                        r.Code = 3;
                        r.Message = "Le nom de fichier ne peut être vide.";
                    }
                }
                else
                {
                    r.Code = 3;
                    r.Message = "Chemin invalide.";
                }
            }
            catch (Exception ex)
            {
                r.Code = 3;
                r.Message = ex.Message;
                return;
            }
            return ;
        }

        public Result SetReport(string ticket,ReportContract report)
        {
            if (this.AddCORS() == false)
                return null;
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
                if (report.Picture != null)
                    r.picture = report.Picture;
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

        public ResultReports GetReport(string ticket, int id)
        {
            if (this.AddCORS() == false)
                return null;
            ResultReports r = new ResultReports();
            try
            {
                if (Auth.WithTicket(ticket) == null)
                    throw new ArgumentException("Vous devez être identifié pour réaliser cette tâche.");
                FuiteKey entities = new FuiteKey();
                Report[] reports = entities.Reports.Where(x => x.id == id).ToArray();
                if (reports.Length <= 0)
                    throw new ArgumentOutOfRangeException();
                ReportContract report = new ReportContract(reports[0]);
                r.Data = new ReportContract[] { report };
            }
            catch(Exception e)
            {
                r.Code = 1;
                r.Message = e.Message;
            }
            return r;
        }

        public ResultReports GetReports(string ticket, State state, int minIndex, int maxIndex)
        {
            if (this.AddCORS() == false)
                return null;
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
                List<ReportContract> results = new List<ReportContract>();
                foreach (Report r in reports)
                {
                    ReportContract rep = new ReportContract(r);
                    rep.Picture = "";
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

        public ResultChanges GetChanges(string ticket, int reportid)
        {
            if (this.AddCORS() == false)
                return null;
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

        public Result SetBanIp(string ticket, string ip)
        {
            if (this.AddCORS() == false)
                return null;
            Result re = new Result();
            try
            {
                if (Auth.WithTicket(ticket) == null)
                {
                    re.Code = 2;
                    throw new ArgumentException("Vous devez être identifié pour réaliser cette tâche.");
                }
                FuiteKey entities = new FuiteKey();
                Ban ban = new Ban();
                ban.ip = ip;
                entities.Bans.Add(ban);
                entities.SaveChanges();
            }
            catch (Exception e)
            {
                if (re.Code == 0)
                    re.Code = -1;
                re.Message = e.Message;
            }
            return re;
        }

        public ResultIp IsIpBan(string ticket, string ip)
        {
            if (this.AddCORS() == false)
                return null;
            ResultIp re = new ResultIp();
            re.Data = false;
            try
            {
                if (Auth.WithTicket(ticket) == null)
                {
                    re.Code = 2;
                    throw new ArgumentException("Vous devez être identifié pour réaliser cette tâche.");
                }
                FuiteKey entities = new FuiteKey();
                if (entities.Bans.Where(x => x.ip == ip).Count() > 0)
                    re.Data = true;
            }
            catch (Exception e)
            {
                if (re.Code == 0)
                    re.Code = -1;
                re.Message = e.Message;
            }
            return re;
        }
    }
}
