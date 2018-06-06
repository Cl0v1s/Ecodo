using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace FuiteAdmin.Report
{
    public partial class ReportItem : System.Web.UI.UserControl
    {

        private ReportService.ReportContract report;

        protected void Page_Load(object sender, EventArgs e)
        {

        }

        public ReportService.ReportContract Report
        {
            get
            {
                return this.report;
            }
            set
            {
                this.report = value;
                if (this.report.Id != null)
                    this.reportId.Text = this.report.Id.ToString();
                else
                    this.reportId.Text = "N/A";
                this.reportIp.Text = this.report.Ip;
                this.link.HRef = this.link.HRef + "?id=" + this.report.Id;
            }
        }
    }
}