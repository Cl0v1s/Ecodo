using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace FuiteAdmin.Report
{
    public partial class ReportPicture : System.Web.UI.UserControl
    {

        protected void Page_Load(object sender, EventArgs e)
        {

        }

        public ReportService.Picture Picture
        {
            get
            {
                return (ReportService.Picture)ViewState["Picture"];
            }
            set
            {
                ViewState["Picture"] = value;
            }
        }

        protected void ban_Click(object sender, EventArgs e)
        {
            string ticket = (string)Session["Ticket"];
            ReportService.ReportServiceClient client = new ReportService.ReportServiceClient();

            ReportService.RemoveContentIpRequest request = new ReportService.RemoveContentIpRequest();
            request.ticket = ticket;
            request.picture = true;
            request.report = false;

            if (this.ban_check.Checked)
            {
                request.report = true;
                request.ip = this.Picture.ip;
            }
            else
                request.id = (int)this.Picture.id;

            ReportService.Result result = client.RemoveContentIp(request);
            if (result.Code != 0)
                throw new HttpException(500, result.Message);
            Response.Redirect(Request.RawUrl);
        }
    }
}