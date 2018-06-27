using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;

namespace FuiteAPI
{
    /// <summary>
    /// Classe utilistaire permettant de gérer l'authentification des utilisateurs 
    /// </summary>
    public class Auth
    {
        /// <summary>
        /// Authentification avec ticket
        /// </summary>
        /// <param name="ticket">ticket de l'utilisateur cherchant à s'authentifier</param>
        /// <returns>L'utilisateur correspondant au ticket, null sinon</returns>
        public static WebSrvPortal.Auth.User WithTicket(string ticket)
        {
            try
            {
                WebSrvPortal.Auth.AuthServiceSoapClient client = new WebSrvPortal.Auth.AuthServiceSoapClient();
                WebSrvPortal.Auth.User user = client.ObtenirUtilisateur(ticket);
                return user;
            }
            catch(Exception e)
            {
                return null;
            }
        }
    }
    
}
