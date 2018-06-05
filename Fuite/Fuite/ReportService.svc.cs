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

        public Result AddReport(Report report)
        {
            if (this.AddCORS() == false)
                return null;
            
            Result r = new Result();
            try
            {
                if (report == null || report.Id != null)
                    throw new ArgumentException("Vous devez préciser un rapport de fuite ne disposant pas d'ID.");
                OperationContext context = OperationContext.Current;
                MessageProperties prop = context.IncomingMessageProperties;
                RemoteEndpointMessageProperty endpoint =
                       prop[RemoteEndpointMessageProperty.Name] as RemoteEndpointMessageProperty;
                string ip = endpoint.Address;
                report.Ip = ip;
                if (report.IsValid() == false)
                    throw new ArgumentException("Vous devez préciser un rapport de fuite complet.");
                FuiteEntities entities = new FuiteEntities();
                entities.Reports.Add(report.Reports);
                entities.SaveChanges();
            }
            catch(Exception e)
            {
                r.Code = 1;
                r.Message = e.Message;
            }
            return r;
        }

        public Result SetReport(Report report)
        {
            if (this.AddCORS() == false)
                return null;
            Result re = new Result();
            try
            {
                if (AuthService.isLogged() == false)
                {
                    re.Code = 2;
                    throw new ArgumentException("Vous devez être identifié pour réaliser cette tâche.");
                }
                if (report == null || report.Id == null)
                {
                    re.Code = 1;
                    throw new ArgumentException("Vous devez préciser un rapport de fuite disposant d'un ID.");
                }
                FuiteEntities entities = new FuiteEntities();
                Reports[] reports = entities.Reports.Where(x => x.id == report.Id).ToArray();
                if (reports.Length <= 0)
                    throw new ArgumentOutOfRangeException();
                Reports r = reports[0];
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
            }
            catch(Exception e)
            {
                re.Message = e.Message;
            }
            return re;
        }

        public Result GetReport(int id)
        {
            if (this.AddCORS() == false)
                return null;
            Result r = new Result();
            try
            {
                if (AuthService.isLogged() == false)
                    throw new ArgumentException("Vous devez être identifié pour réaliser cette tâche.");
                FuiteEntities entities = new FuiteEntities();
                Reports[] reports = entities.Reports.Where(x => x.id == id).ToArray();
                if (reports.Length <= 0)
                    throw new ArgumentOutOfRangeException();
                Report report = new Report(reports[0]);
                r.Data = new Report[] { report };
            }
            catch(Exception e)
            {
                r.Code = 1;
                r.Message = e.Message;
            }
            return r;
        }



        public Result GetReports(State state, int minIndex, int maxIndex)
        {
            if (this.AddCORS() == false)
                return null;
            Result re = new Result();
            try
            {
                if (AuthService.isLogged() == false)
                {
                    re.Code = 2;
                    throw new ArgumentException("Vous devez être identifié pour réaliser cette tâche.");
                }
                FuiteEntities entities = new FuiteEntities();
                Reports[] reports = entities.Reports.Where(x => x.state == (int)state && x.id >= minIndex && x.id <= maxIndex).ToArray();
                List<Report> results = new List<Report>();
                foreach (Reports r in reports)
                {
                    results.Add(new Report(r));
                }
                re.Data = results.ToArray();
            }
            catch(Exception e)
            {
                re.Message = e.Message;
            }
            return re;
        }


    }
}
