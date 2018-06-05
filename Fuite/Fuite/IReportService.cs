using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;

namespace FuiteAPI
{
    [ServiceContract]
    public interface IReportService
    {
        /// <summary>
        /// AJoute une fuite à la base de données
        /// </summary>
        /// <param name="report">Report à ajouter</param>
        /// <returns>True si opération réussie</returns>
        [OperationContract]
        [WebInvoke(Method ="*",ResponseFormat = WebMessageFormat.Json)]
        Result AddReport(Report report);

        /// <summary>
        /// Modifie l'état d'une fuite 
        /// </summary>
        /// <param name="report">Nouvel état de la fuite</param>
        /// <returns>True si opération réussie</returns>
        [OperationContract]
        [WebInvoke(ResponseFormat = WebMessageFormat.Json)]
        Result SetReport(Report report);

        /// <summary>
        /// Récupère la liste de tous les repots de fuite dans la base de données
        /// </summary>
        /// <returns>La liste de tous les reports de fuite</returns>
        [OperationContract]
        [WebGet(ResponseFormat = WebMessageFormat.Json)]
        Result GetReports(State state, int minIndex, int maxIndex);

        [OperationContract]
        [WebGet(ResponseFormat = WebMessageFormat.Json)]
        Result GetReport(int id);
    }

    /// <summary>
    /// Enumération de tous les états possibles pouvant êtres pris par une fuite
    /// </summary>
    public enum State
    {
        New = 0,
        Affected = 1,
        Closed = 2,
        All = 3,
    }


    [DataContract]
    /// <summary>
    /// Représente un signalement de fuite
    /// </summary>
    public class Report
    {
        string ip;
        double? latitude;
        double? longitude;
        string picture;
        string description;
        State state = State.New;
        int? id;

        public bool IsValid()
        {
            if(ip == null || latitude == null || longitude == null || picture == null)
            {
                return false;
            }
            return true;
        }

        public Report(Reports reports)
        {
            this.Id = reports.id;
            this.Latitude = reports.latitude;
            this.Longitude = reports.longitude;
            this.Picture = reports.picture;
            this.Description = reports.description;
            this.state = (State)reports.state;
            this.Ip = reports.ip;
        }

        public Reports Reports
        {
            get
            {
                Reports r = new Reports();
                if(this.Id != null)
                    r.id = (int)this.Id;
                if(this.Latitude != null)
                    r.latitude = (double)this.Latitude;
                if(this.Longitude != null)
                    r.longitude = (double)this.Longitude;
                r.picture = this.Picture;
                r.description = this.Description;
                r.state = (int)this.State;
                r.ip = this.Ip;
                return r;
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

