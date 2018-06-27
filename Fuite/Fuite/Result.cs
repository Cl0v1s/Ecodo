using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;

namespace FuiteAPI
{
    /// <summary>
    /// Représente le résultat d'une opération renvoyé à un utilisateur
    /// </summary>
    [DataContract]
    public class Result
    {

        public Result()
        {
            this.Code = 0;
            this.Message = "OK";
        }

        public Result(int code, string msg)
        {
            this.Code = code;
            this.Message = msg;
        }

        [DataMember]
        public string Message
        {
            get; set;
        }

        /// <summary>
        /// Code de résultat, 0 si ok, autre sinon
        /// </summary>
        [DataMember]
        public int Code
        {
            get;set;
        }
    }

    /// <summary>
    /// Représente le résultat d'une opération de récupération de un ou plusieurs reports
    /// </summary>
    [DataContract]
    public class ResultReports : Result
    {

        /// <summary>
        /// Liste des reports contenus dans la réponse
        /// </summary>
        [DataMember]
        public ReportRequest[] Data
        {
            get; set;
        }
    }

    /// <summary>
    /// Représente le résultat d'une opération de récupération de photographies
    /// </summary>
    [DataContract]
    public class ResultPictures : Result
    {
        /// <summary>
        /// Liste des photographies
        /// </summary>
        [DataMember]
        public Picture[] Data
        {
            get;set;
        }
    }

    /// <summary>
    /// Représente le résultat d'une opérations de récupération de changements
    /// </summary>
    [DataContract]
    public class ResultChanges : Result
    {

        /// <summary>
        /// Liste des changements
        /// </summary>
        [DataMember]
        public Change[] Data
        {
            get; set;
        }
    }

}