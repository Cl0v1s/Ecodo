using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.HtmlControls;

namespace FuiteAdmin
{
    public partial class Details : System.Web.UI.Page
    {

        private ReportService.ReportContract report;

        protected void Page_Load(object sender, EventArgs e)
        {

            string ticket = (string)Session["Ticket"];
            int id = Int32.Parse(Request.QueryString["id"]);
            ReportService.ReportServiceClient client = new ReportService.ReportServiceClient();
            ReportService.ResultReports result = client.GetReport(ticket, id);
            if (result.Code != 0)
                throw new HttpException(500, result.Message);
            if (result.Data.Length <= 0)
                throw new HttpException(404, "Il n'existe pas de signalement possédant cet Id.");
            this.Report = (ReportService.ReportContract)result.Data[0];
        }

        public ReportService.ReportContract Report
        {
            set
            {
                string ticket = (string)Session["Ticket"];
                this.report = value;

                this.reportIp.Text = this.report.Ip;
                this.reportDate.Text = this.report.Date.ToString("dd/MM/yy hh:mm");
                this.reportGeolocation.Text = this.report.Latitude + " " + this.report.Longitude;
                this.reportState.Value = ((int)this.report.State).ToString();

                string[] states = new string[]
                {
                    "Nouveau", "Affecté", "En cours"
                };
                ReportService.ReportServiceClient client = new ReportService.ReportServiceClient();
                ReportService.ResultChanges response = client.GetChanges(ticket, (int)this.report.Id);

                if (response.Code != 0)
                    throw new HttpException(500, response.Message);

                foreach (ReportService.Change change in response.Data)
                {
                    HtmlTableRow tr = new HtmlTableRow();
                    HtmlTableCell td = new HtmlTableCell();
                    td.InnerText = change.date.ToString("dd/MM/yy hh:mm");
                    tr.Controls.Add(td);
                    td = new HtmlTableCell();
                    td.InnerText = states[(int)change.state];
                    tr.Controls.Add(td);
                    td = new HtmlTableCell();
                    /*ReportService.User op = change.Operator;
                    if (op == null)
                        td.InnerText = "N/A";
                    else
                        td.InnerText = op.nomCompletField;
                    tr.Controls.Add(td);*/
                    this.reportHistory.Controls.Add(tr);
                }
            }
        }

        protected void updateState_Click(object sender, EventArgs e)
        {

        }
    }
}