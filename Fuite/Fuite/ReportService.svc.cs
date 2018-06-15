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
                report.Date = DateTime.Now;

                Report[] reports = entities.Reports.Where(x => x.state != (int)State.Closed &&
                    report.Latitude - x.latitude <= 0.0001 && report.Longitude - x.longitude <= 0.0001 && DbFunctions.DiffDays(report.Date, x.date) < 1
                ).ToArray();
                if (reports.Count() > 0)
                {
                    foreach(Report re in reports)
                    {
                        re.quantity += 1;
                    }
                    entities.SaveChanges();
                    return r;
                }

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

        

        public Result SetReport(SetReportRequest request)
        {
            if (this.AddCORS() == false)
                return null;

            string ticket = request.ticket;
            ReportContract report = request.report;

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
                ReportContract report = new ReportContract(reports[0]);
                if (report.Date <= DateTime.MinValue || report.Date >= DateTime.MaxValue)
                    report.Date = DateTime.Now;

                r.Data = new ReportContract[] { report };
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
                List<ReportContract> results = new List<ReportContract>();
                foreach (Report r in reports)
                {
                    ReportContract rep = new ReportContract(r);
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

        public Result SetBanIp(BanIpRequest request)
        {
            if (this.AddCORS() == false)
                return null;
            string ticket = request.ticket;
            string ip = request.ip;
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

        public ResultIp IsIpBan(BanIpRequest request)
        {
            if (this.AddCORS() == false)
                return null;
            string ticket = request.ticket;
            string ip = request.ip;

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
