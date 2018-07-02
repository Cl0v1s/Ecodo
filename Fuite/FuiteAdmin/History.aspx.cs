using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.HtmlControls;


namespace FuiteAdmin
{
    /// <summary>
    /// Ecran d'affichage de tous les reports de fuite en fonction de leur état dans un tableau
    /// </summary>
    public partial class History : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            this.Update();
        }

        /// <summary>
        /// Met à jour la construction de la page 
        /// </summary>
        /// <param name="state">Etat des reports à afficher</param>
        private void Update(ReportService.State state = ReportService.State.New)
        {
            string ticket = (string)Session["Ticket"];
            ReportService.ReportServiceClient client = new ReportService.ReportServiceClient();
            ReportService.GetReportsRequest request = new ReportService.GetReportsRequest();
            request.ticket = ticket;
            request.state = state;
            request.minIndex = -1;
            request.maxIndex = Int32.MaxValue;
            ReportService.ResultReports results = client.GetReports(request);

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

            // Construction du tableau des reports
            foreach (ReportService.ReportRequest report in results.Data)
            {
                HtmlTableRow tr = new HtmlTableRow();
                HtmlTableCell td = new HtmlTableCell();
                td.InnerText = "#"+report.Id.ToString();
                tr.Controls.Add(td);
                td = new HtmlTableCell();
                td.InnerText = states[(int)report.State];
                tr.Controls.Add(td);
                td = new HtmlTableCell();
                td.InnerText = report.Date.ToString("dd/MM/yy HH:mm");
                tr.Controls.Add(td);
                td = new HtmlTableCell();
                HtmlAnchor a = new HtmlAnchor();
                a.InnerText = "Voir";
                a.Attributes["class"] = "button small";
                a.HRef = "Details.aspx?id=" + report.Id;
                td.Controls.Add(a);
                tr.Controls.Add(td);
                this.history.Controls.Add(tr);
            }
            
        }

        /// <summary>
        /// Affichage des nouveaux reports
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        protected void new_Click(object sender, EventArgs e)
        {
            this.Update(ReportService.State.New);
            this.@new.CssClass += " selected";
            this.current.CssClass = this.current.CssClass.Replace(" selected", "");
            this.closed.CssClass = this.closed.CssClass.Replace(" selected", "");
        }

        /// <summary>
        /// Affichage des reports en cours de traitement
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        protected void current_Click(object sender, EventArgs e)
        {
            this.Update(ReportService.State.Affected);
            this.current.CssClass += " selected";
            this.@new.CssClass = this.@new.CssClass.Replace(" selected", "");
            this.closed.CssClass = this.closed.CssClass.Replace(" selected", "");
        }

        /// <summary>
        /// Affichage des reports terminés
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        protected void closed_Click(object sender, EventArgs e)
        {
            this.Update(ReportService.State.Closed);
            this.closed.CssClass += " selected";
            this.@new.CssClass = this.@new.CssClass.Replace(" selected", "");
            this.current.CssClass = this.current.CssClass.Replace(" selected", "");
        }
    }
}