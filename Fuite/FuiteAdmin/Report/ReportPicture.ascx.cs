using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace FuiteAdmin.Report
{
    /// <summary>
    /// Element d'interface présentant une photographie associée à un report
    /// </summary>
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

       
    }
}