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

        protected void Page_Load(object sender, EventArgs e)
        {
            if (IsPostBack)
                return;
            this.Update();
        }

        private void Update()
        {
            string ticket = (string)Session["Ticket"];
            int id = Int32.Parse(Request.QueryString["id"]);
            ReportService.ReportServiceClient client = new ReportService.ReportServiceClient();
            ReportService.GetReportRequest request = new ReportService.GetReportRequest();
            request.ticket = ticket;
            request.id = id;
            ReportService.ResultReports result = client.GetReport(request);
            if (result.Code != 0)
                throw new HttpException(500, result.Message);
            if (result.Data.Length <= 0)
                throw new HttpException(404, "Il n'existe pas de signalement possédant cet Id.");
            this.Report = (ReportService.ReportContract)result.Data[0];

            ReportService.BanIpRequest ipreq = new ReportService.BanIpRequest();
            ipreq.ticket = ticket;
            ipreq.ip = this.Report.Ip;

            ReportService.ResultIp response = client.IsIpBan(ipreq);
            if (response.Code != 0)
                throw new HttpException(500, response.Message);
            if (response.Data)
                this.ban.Visible = false;

        }

        public ReportService.ReportContract Report
        {
            get
            {
                return (ReportService.ReportContract)ViewState["Report"];
            }
            set
            {
                string ticket = (string)Session["Ticket"];
                ViewState["Report"] = value;
                this.reportState.Value = ((int)value.State).ToString();

                string[] states = new string[]
                {
                    "Nouveau", "Affecté", "Traité"
                };
                ReportService.ReportServiceClient client = new ReportService.ReportServiceClient();
                ReportService.GetChangesRequest request = new ReportService.GetChangesRequest();
                request.ticket = ticket;
                request.reportId = (int)value.Id;
                ReportService.ResultChanges response = client.GetChanges(request);

                if (response.Code != 0)
                    throw new HttpException(500, response.Message);

                foreach (ReportService.Change change in response.Data.Reverse())
                {
                    HtmlTableRow tr = new HtmlTableRow();
                    HtmlTableCell td = new HtmlTableCell();
                    td.InnerText = change.date.ToString("dd/MM/yy hh:mm");
                    tr.Controls.Add(td);
                    td = new HtmlTableCell();
                    td.InnerText = states[(int)change.state];
                    tr.Controls.Add(td);
                    td = new HtmlTableCell();
                    ReportService.User op = change.Operator;
                    if (op == null)
                        td.InnerText = "N/A";
                    else
                        td.InnerText = op.nomCompletField;
                    tr.Controls.Add(td);
                    this.reportHistory.Controls.Add(tr);
                }
            }
        }

        protected void updateState_Click(object sender, EventArgs e)
        {
            ReportService.ReportContract report = (ReportService.ReportContract)ViewState["Report"];

            string ticket = (string)Session["Ticket"];
            int value = Int32.Parse(this.reportState.Items[this.reportState.SelectedIndex].Value);
            if (value == (int)report.State)
                return;
            ReportService.ReportServiceClient client = new ReportService.ReportServiceClient();
            ReportService.ReportContract nreport = new ReportService.ReportContract();
            nreport.State = (ReportService.State)value;
            nreport.Id = report.Id;

            ReportService.SetReportRequest request = new ReportService.SetReportRequest();
            request.ticket = ticket;
            request.report = nreport;

            ReportService.Result response =  client.SetReport(request);
            if (response.Code != 0)
                throw new HttpException(500, response.Message);
            this.Update();
            //TODO: ajouter un message de validation
        }

        protected void ban_Click(object sender, EventArgs e)
        {
            string ticket = (string)Session["Ticket"];
            ReportService.ReportServiceClient client = new ReportService.ReportServiceClient();

            ReportService.BanIpRequest request = new ReportService.BanIpRequest();
            request.ticket = ticket;
            request.ip = this.Report.Ip;

            ReportService.Result result = client.SetBanIp(request);
            if (result.Code != 0)
                throw new HttpException(500, result.Message);
            this.Update();
            //TODO: ajouter un message de validation
        }
    }
}