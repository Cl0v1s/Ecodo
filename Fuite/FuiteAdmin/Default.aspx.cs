using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace FuiteAdmin
{
    public partial class Default : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            string ticket = (string)Session["Ticket"];

            ReportService.ReportServiceClient client = new ReportService.ReportServiceClient();
            ReportService.GetReportsRequest request = new ReportService.GetReportsRequest();
            request.ticket = ticket;
            request.state = ReportService.State.New;
            request.minIndex = -1;
            request.maxIndex = Int32.MaxValue;
            ReportService.ResultReports response = client.GetReports(request);
            if (response.Code != 0)
                throw new Exception(response.Message);
            this.Reports = response.Data.OrderBy(x => x.Quantity).ToArray();
            foreach(ReportService.ReportContract report in this.Reports)
            {
                Control control = LoadControl("Report/ReportItem.ascx");
                ((Report.ReportItem)control).Report = report;
                this.reportList.Controls.Add(control);
            }
        }

        public ReportService.ReportContract[] Reports
        {
            get; set;
        }
    }
}