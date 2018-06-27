using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;
using System.IO;

namespace FuiteAPI
{

    /// <summary>
    /// Contrat définissant l'interface devant être exposée par l'API
    /// </summary>
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
        Result AddReport(ReportRequest report);

        /// <summary>
        /// Modifie l'état d'une fuite 
        /// </summary>
        /// <param name="report">Nouvel état de la fuite</param>
        /// <returns>True si opération réussie</returns>
        [OperationContract]
        [WebInvoke(Method ="*",
        ResponseFormat = WebMessageFormat.Json)]
        Result SetReport(SetReportRequest request);

        /// <summary>
        /// Récupère la liste de tous les reports de fuite dans la base de données
        /// </summary>
        /// <returns>La liste de tous les reports de fuite</returns>
        [OperationContract]
        [WebInvoke(Method = "*",
        ResponseFormat = WebMessageFormat.Json)]
        ResultReports GetReports(GetReportsRequest request);

        /// <summary>
        /// Récupère la liste de toutes les photos en fonction des paramètres précisés dans la requête 
        /// </summary>
        /// <param name="request">Requete contenant les paramètres de recherche de photo</param>
        /// <returns>Objet Result contenant la liste de photos</returns>
        [OperationContract]
        [WebInvoke(Method = "*", ResponseFormat = WebMessageFormat.Json)]
        ResultPictures GetPictures(GetPicturesRequest request);

        /// <summary>
        /// Récupère la liste de tous les repots de fuite dans la base de données
        /// </summary>
        /// <returns>La liste de tous les reports de fuite</returns>
        [OperationContract]
        [WebInvoke(Method = "*",
        ResponseFormat = WebMessageFormat.Json)]
        ResultChanges GetChanges(GetChangesRequest request);

        /// <summary>
        /// Récupère un report de fuite en fonction des paramètres contenus dans la requête
        /// </summary>
        /// <param name="request">Paramètres de la requête</param>
        /// <returns>Une liste contenant le rapport de fuite correspondant aux paramètres de la requête</returns>
        [OperationContract]
        [WebInvoke(Method = "*",
        ResponseFormat = WebMessageFormat.Json)]
        ResultReports GetReport(GetReportRequest request);

        /// <summary>
        /// Supprime le contenu (rapport et/ou photographies) en fonction d'une adresse IP ou d'un id selon la requête
        /// </summary>
        /// <param name="request">Paramètres de la requête</param>
        /// <returns>Le résultat de l'opération</returns>
        [OperationContract]
        [WebInvoke(Method = "*",
        ResponseFormat = WebMessageFormat.Json)]
        Result RemoveContentIp(RemoveContentIpRequest request);
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


}




