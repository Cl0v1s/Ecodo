using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;

namespace FuiteAPI
{
    public class ReportService : IReportService
    {
        public Result AddReport(Report report)
        {
            Result r = new Result();
            try
            {
                if (report == null || report.Id != null)
                    throw new ArgumentException("Vous devez préciser un rapport de fuite ne disposant pas d'ID.");
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
