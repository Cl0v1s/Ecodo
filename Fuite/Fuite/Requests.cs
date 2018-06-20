using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Runtime.Serialization;

namespace FuiteAPI
{
    public abstract class Request
    {
        public string ticket { get; set; }
    }

    public class SetReportRequest : Request
    {
        public ReportRequest report { get; set; }
    }

    public class GetPicturesRequest : Request
    {
        public int reportId { get; set; }
    }

    public class GetReportsRequest : Request
    {
        public State state { get; set; }
        public int minIndex { get; set; }
        public int maxIndex { get; set; }
    }

    public class GetChangesRequest : Request
    {
        public int reportId { get; set; }
    }

    public class GetReportRequest : Request
    {
        public int id { get; set; }
    }

    public class RemoveContentIpRequest : Request
    {
        public string ip { get; set; }

        public bool picture { get; set; }

        public bool report { get; set; }

        public int id { get; set; }
    }

    [DataContract]
    /// <summary>
    /// Représente un signalement de fuite
    /// </summary>
    public class ReportRequest
    {



        public bool IsValid()
        {
            if (this.Ip == null || this.Latitude == null || this.Longitude == null || this.Picture == null)
            {
                return false;
            }
            return true;
        }

        public ReportRequest(Report report)
        {
            this.Id = report.id;
            this.Latitude = report.latitude;
            this.Longitude = report.longitude;
            this.Description = report.description;
            this.State = (State)report.state;
            this.Date = report.date;
            this.Ip = report.ip;
            this.Quantity = report.quantity;
            if (report.Pictures.Count > 0)
                this.Picture = report.Pictures.First().data;
        }

        public Report Report
        {
            get
            {
                Report r = new Report();
                if (this.Id != null)
                    r.id = (int)this.Id;
                if (this.Latitude != null)
                    r.latitude = (double)this.Latitude;
                if (this.Longitude != null)
                    r.longitude = (double)this.Longitude;
                r.description = this.Description;
                r.state = (int)this.State;
                r.date = this.Date;
                r.ip = this.Ip;
                return r;

            }
        }


        [DataMember]
        public DateTime Date
        {
            get;set;
        }

        [DataMember]
        public int? Id
        {
            get;set;
        }

        [DataMember]
        public State State
        {
            get;set;
        }

        [DataMember]
        public string Ip
        {
            get;set;
        }

        [DataMember]
        public double? Latitude
        {
            get;set;
        }


        [DataMember]
        public double? Longitude
        {
            get;set;
        }

        [DataMember]
        public string Picture
        {
            get;set;
        }

        [DataMember]
        public string Description
        {
            get;set;
        }

        [DataMember]
        public int Quantity
        {
            get;set;
        }
    }
}