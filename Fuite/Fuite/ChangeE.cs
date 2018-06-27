using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FuiteAPI
{
    /// <summary>
    /// Classe partielle définissant des accesseurs utilitaires à la classe de modèle Change
    /// </summary>
    public partial class Change
    {
        /// <summary>
        /// Permet d'accéder à l'opérateur associé à un changement
        /// </summary>
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