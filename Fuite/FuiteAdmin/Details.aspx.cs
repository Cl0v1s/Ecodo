using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;

namespace FuiteAdmin
{
    public partial class Details : System.Web.UI.Page
    {

        protected void Page_Load(object sender, EventArgs e)
        {
            this.BuildPictures();
            if (IsPostBack)
                return;
            this.Update();
            this.BuildPictures();
        }

        private void BuildPictures()
        {
            if (this.Pictures == null)
                return;
            foreach (ReportService.Picture pic in this.Pictures)
            {
                Control control = LoadControl("Report/ReportPicture.ascx");
                ((FuiteAdmin.Report.ReportPicture)control).Picture = pic;
                this.ReportPictures.Controls.Add(control);
            }
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
            this.Report = (ReportService.ReportRequest)result.Data[0];

        }

        public ReportService.Picture[] Pictures
        {
            get
            {
                return (ReportService.Picture[])ViewState["Pictures"];
            }
            set
            {
                ViewState["Pictures"] = value;
            }
        }

        public ReportService.ReportRequest Report
        {
            get
            {
                return (ReportService.ReportRequest)ViewState["Report"];
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

                // Récupération Photo
                ReportService.GetPicturesRequest req = new ReportService.GetPicturesRequest();
                req.ticket = ticket;
                req.reportId = (int)this.Report.Id;
                ReportService.ResultPictures resp = client.GetPictures(req);

                if (resp.Code != 0)
                    throw new HttpException(500, resp.Message);

                this.Pictures = resp.Data;


                // Récupération des changements
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
            ReportService.ReportRequest report = (ReportService.ReportRequest)ViewState["Report"];

            string ticket = (string)Session["Ticket"];
            int value = Int32.Parse(this.reportState.Items[this.reportState.SelectedIndex].Value);
            if (value == (int)report.State)
                return;
            ReportService.ReportServiceClient client = new ReportService.ReportServiceClient();
            ReportService.ReportRequest nreport = new ReportService.ReportRequest();
            nreport.State = (ReportService.State)value;
            nreport.Id = report.Id;

            ReportService.SetReportRequest request = new ReportService.SetReportRequest();
            request.ticket = ticket;
            request.report = nreport;

            ReportService.Result response =  client.SetReport(request);
            if (response.Code != 0)
                throw new HttpException(500, response.Message);
            this.Update();
        }

        protected void ban_Click(object sender, EventArgs e)
        {
            string ticket = (string)Session["Ticket"];
            ReportService.ReportServiceClient client = new ReportService.ReportServiceClient();

            ReportService.RemoveContentIpRequest request = new ReportService.RemoveContentIpRequest();
            request.ticket = ticket;
            request.report = true;
            request.picture = false;

            if (this.ban_check.Checked)
            {
                request.picture = true;
                request.ip = this.Report.Ip;
            }
            else
                request.id = (int)this.Report.Id;

            ReportService.Result result = client.RemoveContentIp(request);
            if (result.Code != 0)
                throw new HttpException(500, result.Message);
            Response.Redirect("History.aspx");
        }

        protected void BanPicture_Click(object sender, EventArgs e)
        {
            string ticket = (string)Session["Ticket"];
            List<ReportService.Picture> pictures = new List<ReportService.Picture>();
            foreach(Control ctrl in this.ReportPictures.Controls)
            {
                if (!(ctrl is Report.ReportPicture))
                    continue;
                CheckBox check = (CheckBox)ctrl.FindControl("check");
                if (check == null || check.Checked == false)
                    continue;
                pictures.Add(((Report.ReportPicture)ctrl).Picture);
            }

            foreach(ReportService.Picture picture in pictures)
            {
                ReportService.ReportServiceClient client = new ReportService.ReportServiceClient();
                ReportService.RemoveContentIpRequest request = new ReportService.RemoveContentIpRequest();
                request.ticket = ticket;
                if (this.BanPicture_check.Checked)
                {
                    request.picture = true;
                    request.report = true;
                    request.ip = picture.ip;
                }
                else
                {
                    request.picture = true;
                    request.id = picture.id;
                }
                ReportService.Result result = client.RemoveContentIp(request);
                if (result.Code != 0)
                    throw new HttpException(500, result.Message);
            }
            Response.Redirect(Request.RawUrl);
        }
    }
}