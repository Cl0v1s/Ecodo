using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.HtmlControls;


namespace FuiteAdmin
{
    public partial class History : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
                return;
            this.Update();
        }

        private void Update(ReportService.State state = ReportService.State.New)
        {
            string ticket = (string)Session["Ticket"];
            ReportService.ReportServiceClient client = new ReportService.ReportServiceClient();
            ReportService.ResultReports results = client.GetReports(ticket, state, -1, Int32.MaxValue);

            if (results.Code != 0)
                throw new HttpException(500, results.Message);

            this.history.Controls.Clear();
            string[] states = new string[]
            {
                    "Nouveau", "Affecté", "Traité"
            };

            results.Data = results.Data.OrderBy(x => x.Date).ToArray();
            if (state != ReportService.State.New)
                results.Data = results.Data.Reverse().ToArray();

            foreach (ReportService.ReportContract report in results.Data)
            {
                HtmlTableRow tr = new HtmlTableRow();
                HtmlTableCell td = new HtmlTableCell();
                td.InnerText = "#"+report.Id.ToString();
                tr.Controls.Add(td);
                td = new HtmlTableCell();
                td.InnerText = states[(int)report.State];
                tr.Controls.Add(td);
                td = new HtmlTableCell();
                td.InnerText = report.Date.ToString("dd/MM/yy hh:mm");
                tr.Controls.Add(td);
                td = new HtmlTableCell();
                HtmlAnchor a = new HtmlAnchor();
                a.InnerText = "Voir";
                a.Attributes["class"] = "button";
                a.HRef = "Details.aspx?id=" + report.Id;
                td.Controls.Add(a);
                tr.Controls.Add(td);
                this.history.Controls.Add(tr);
            }
            
        }

        protected void new_Click(object sender, EventArgs e)
        {
            this.Update(ReportService.State.New);
        }

        protected void current_Click(object sender, EventArgs e)
        {
            this.Update(ReportService.State.Affected);
        }

        protected void closed_Click(object sender, EventArgs e)
        {
            this.Update(ReportService.State.Closed);
        }
    }
}