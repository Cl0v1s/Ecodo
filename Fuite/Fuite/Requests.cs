using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FuiteAPI
{
    public abstract class Request
    {
        public string ticket { get; set; }
    }

    public class SetReportRequest : Request
    {
        public ReportContract report { get; set; }
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

    public class BanIpRequest : Request
    {
        public string ip { get; set; }
    }
}