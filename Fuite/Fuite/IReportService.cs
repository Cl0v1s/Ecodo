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
        Result AddReport(ReportContract report);

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
        /// Récupère la liste de tous les repots de fuite dans la base de données
        /// </summary>
        /// <returns>La liste de tous les reports de fuite</returns>
        [OperationContract]
        [WebInvoke(Method = "*",
        ResponseFormat = WebMessageFormat.Json)]
        ResultReports GetReports(GetReportsRequest request);

        /// <summary>
        /// Récupère la liste de tous les repots de fuite dans la base de données
        /// </summary>
        /// <returns>La liste de tous les reports de fuite</returns>
        [OperationContract]
        [WebInvoke(Method = "*",
        ResponseFormat = WebMessageFormat.Json)]
        ResultChanges GetChanges(GetChangesRequest request);

        [OperationContract]
        [WebInvoke(Method = "*",
        ResponseFormat = WebMessageFormat.Json)]
        ResultReports GetReport(GetReportRequest request);

        [OperationContract]
        [WebInvoke(Method = "*",
        ResponseFormat = WebMessageFormat.Json)]
        Result SetBanIp(BanIpRequest request);

        [OperationContract]
        [WebInvoke(Method = "*",
        ResponseFormat = WebMessageFormat.Json)]
        ResultIp IsIpBan(BanIpRequest request);
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




