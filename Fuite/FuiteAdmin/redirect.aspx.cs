using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace FuiteAdmin
{
    public partial class redirect : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            string ticket = Request.Params["ticket"];
#if DEBUG
            //en mode débug, on s'auth en tant que TFernandez
            ticket = "126017012170007053133045245096122113090143035228009085053235109097029023100197079041189022164020|924736173243919101105362615685171802251654022510";
            //en mode débug, on s'auth en tant que TFerrand
            //ticket = "019044003047062184116077025031168039161033072095047030160131075224236145103156029117240154229221|1381797713612319069553018784177193742471200100203111";
#endif
            Session["Ticket"] = ticket;
            Response.Redirect("Default.aspx");
        }
    }
}