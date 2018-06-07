using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;

namespace FuiteAPI
{
    public class Auth
    {
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
