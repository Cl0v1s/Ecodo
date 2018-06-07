using System;
using System.Collections.Generic;
using System.Runtime.Serialization;
using System.Linq;
using System.Web;

namespace FuiteAPI
{
    [DataContract]
    /// <summary>
    /// Représente un signalement de fuite
    /// </summary>
    public class ReportContract
    {
        string ip;
        double? latitude;
        double? longitude;
        string picture;
        string description;
        State state = State.New;
        DateTime date;
        int? id;


        public bool IsValid()
        {
            if (ip == null || latitude == null || longitude == null || picture == null)
            {
                return false;
            }
            return true;
        }

        public ReportContract(Report reports)
        {
            this.Id = reports.id;
            this.Latitude = reports.latitude;
            this.Longitude = reports.longitude;
            this.Picture = reports.picture;
            this.Description = reports.description;
            this.state = (State)reports.state;
            this.date = reports.date;
            this.Ip = reports.ip;
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
                    r.picture = this.Picture;
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
            get
            {
                return this.date;
            }
            set
            {
                this.date = value;
            }
        }

        [DataMember]
        public int? Id
        {
            get
            {
                return this.id;
            }

            set
            {
                this.id = value;
            }
        }

        [DataMember]
        public State State
        {
            get
            {
                return this.state;
            }
            set
            {
                this.state = value;
            }
        }

        [DataMember]
        public string Ip
        {
            get
            {
                return this.ip;
            }
            set
            {
                this.ip = value;
            }
        }

        [DataMember]
        public double? Latitude
        {
            get
            {
                return this.latitude;
            }

            set
            {
                this.latitude = value;
            }
        }


        [DataMember]
        public double? Longitude
        {
            get
            {
                return this.longitude;
            }
            set
            {
                this.longitude = value;
            }
        }

        [DataMember]
        public string Picture
        {
            get
            {
                return this.picture;
            }
            set
            {
                this.picture = value;
            }
        }

        [DataMember]
        public string Description
        {
            get
            {
                return this.description;
            }
            set
            {
                this.description = value;
            }
        }
    }
}