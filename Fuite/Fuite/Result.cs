using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;

namespace FuiteAPI
{
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

        [DataMember]
        public int Code
        {
            get;set;
        }
    }


    [DataContract]
    public class ResultReports : Result
    {

        [DataMember]
        public ReportRequest[] Data
        {
            get; set;
        }
    }

    [DataContract]
    public class ResultPictures : Result
    {
        [DataMember]
        public Picture[] Data
        {
            get;set;
        }
    }


    [DataContract]
    public class ResultChanges : Result
    {

        [DataMember]
        public Change[] Data
        {
            get; set;
        }
    }

    [DataContract]
    public class ResultIp : Result
    {

        [DataMember]
        public bool Data
        {
            get; set;
        }
    }
}