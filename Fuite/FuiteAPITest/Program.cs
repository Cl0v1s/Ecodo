using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ServiceModel.Web;
using System.ServiceModel.Description;

namespace FuiteAPITest
{
    class Program
    {
        static void Main(string[] args)
        {
            WebServiceHost host = new WebServiceHost(typeof(FuiteAPI.ReportService), new Uri("http://localhost:8000/Reports"));
            //ServiceEndpoint ep = host.AddServiceEndpoint(typeof(FuiteAPI.IReportService), new System.ServiceModel.BasicHttpBinding(), "reports");
            host.Open();
            Console.WriteLine("Service is running");
            Console.WriteLine("Press enter to quit...");
            Console.ReadLine();
            host.Close();
        }
    }
}
