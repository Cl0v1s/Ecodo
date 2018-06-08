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

            ReportService.ResultReports response = client.GetReports(ticket, ReportService.State.New, -1, Int32.MaxValue);
            if (response.Code != 0)
                throw new Exception(response.Message);
            this.Reports = response.Data.OrderBy(x => x.Date).ToArray();
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