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
            ReportService.ReportContract[] reports = (ReportService.ReportContract[])response.Data;
            reports = reports.OrderBy(x => x.Date).ToArray();
            foreach(ReportService.ReportContract report in reports)
            {
                Control control = LoadControl("Report/ReportItem.ascx");
                ((Report.ReportItem)control).Report = report;
                this.reportList.Controls.Add(control);
            }
        }
    }
}