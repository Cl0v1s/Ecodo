using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FuiteAPI
{
    public partial class Change
    {
        public WebSrvPortal.Auth.User Operator {
            get
            {
                if (this.Operator_id == null)
                    return null;
                WebSrvPortal.Auth.AuthServiceSoapClient client = new WebSrvPortal.Auth.AuthServiceSoapClient();
                return client.ObtenirUtilisateurSurIdentifiant((Guid)this.Operator_id);
            }
            set
            {

            }
        }
    }
}