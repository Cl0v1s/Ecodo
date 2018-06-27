using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Runtime.Serialization;

namespace FuiteAPI
{
    /// <summary>
    /// Requête de base, comprenant le ticket de l'utilisateur à son origine
    /// </summary>
    public abstract class Request
    {
        /// <summary>
        /// Ticket de l'utilisateur
        /// </summary>
        public string ticket { get; set; }
    }

    /// <summary>
    /// Requête permettant de préciser la modification d'un report existant
    /// </summary>
    public class SetReportRequest : Request
    {
        /// <summary>
        /// Objet report comprenant les modifications à effctuer en base
        /// </summary>
        public ReportRequest report { get; set; }
    }

    /// <summary>
    /// Requête permettant de récupérer les photographies associées à un report
    /// </summary>
    public class GetPicturesRequest : Request
    {
        /// <summary>
        /// ID du report dont on doit retourner les photographies
        /// </summary>
        public int reportId { get; set; }
    }

    /// <summary>
    /// Requête permettant de récupérer une liste de reports correspondant à un certain nombre de paramètres
    /// </summary>
    public class GetReportsRequest : Request
    {
        /// <summary>
        /// Etat des reports à récupérer
        /// </summary>
        public State state { get; set; }
        /// <summary>
        /// ID minimum des reports à récupérer
        /// </summary>
        public int minIndex { get; set; }
        /// <summary>
        /// ID maximum des reports à récupérer
        /// </summary>
        public int maxIndex { get; set; }
    }

    /// <summary>
    /// Requête permettant de récupérer la liste des changements associés à un  report
    /// </summary>
    public class GetChangesRequest : Request
    {
        /// <summary>
        /// ID du report dont on doit retourner les changements
        /// </summary>
        public int reportId { get; set; }
    }

    /// <summary>
    /// Requête permettant de récupérer un report
    /// </summary>
    public class GetReportRequest : Request
    {
        /// <summary>
        /// ID du report à récupérer
        /// </summary>
        public int id { get; set; }
    }

    /// <summary>
    /// Requête permettant de supprimer du contenu en base de données
    /// </summary>
    public class RemoveContentIpRequest : Request
    {
        /// <summary>
        /// Adresse IP de l"utilisateur dont on doit supprimer le contenu
        /// </summary>
        public string ip { get; set; }

        /// <summary>
        /// Vrai si on doit supprimer une (id) ou plusieurs (ip) photographie(s)
        /// </summary>
        public bool picture { get; set; }

        /// <summary>
        /// Vrai si on doit supprimer un (id) ou plusieurs (ip) report(s)
        /// </summary>
        public bool report { get; set; }

        /// <summary>
        /// ID du contenu à supprimer 
        /// </summary>
        public int id { get; set; }
    }

    [DataContract]
    /// <summary>
    /// Représente un signalement de fuite
    /// </summary>
    public class ReportRequest
    {

        /// <summary>
        /// Détermine si la demande permet de construire un rapport valide
        /// </summary>
        /// <returns>Vrai si valide</returns>
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

        /// <summary>
        /// Construit un objet de modèle Report à partir de la présente requête
        /// </summary>
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