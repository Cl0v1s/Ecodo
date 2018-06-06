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
            this.Data = null;
        }

        public Result(int code, string msg)
        {
            this.Code = code;
            this.Message = msg;
        }

        [DataMember]
        public ReportContract[] Data
        {
            get;set;
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
}