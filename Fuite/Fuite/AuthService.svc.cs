using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;
using System.Web.Security;
using System.ServiceModel.Channels;
using System.Net;
using System.Web;

namespace FuiteAPI
{
    public class AuthService : IAuthService
    {

        public static WebSrvPortal.Auth.User isLogged()
        {
            HttpRequestMessageProperty httpRequest = OperationContext.Current.IncomingMessageProperties[HttpRequestMessageProperty.Name]
            as HttpRequestMessageProperty;
            if (httpRequest == null)
                return null;
            string cookie = httpRequest.Headers[HttpRequestHeader.Cookie];
            if (String.IsNullOrEmpty(cookie))
                return null;
            cookie = cookie.Split('=')[1];
            string user = cookie;
            WebSrvPortal.Auth.AuthServiceSoapClient client = new WebSrvPortal.Auth.AuthServiceSoapClient();
            return client.ObtenirUtilisateur(user);
        }

        public Result Login(string username, string password)
        {
            Result r = new Result();
            WebSrvPortal.Auth.AuthServiceSoapClient client = new WebSrvPortal.Auth.AuthServiceSoapClient();
            WebSrvPortal.Auth.User user = client.ObtenirUtilisateurAvecLogin(username, password);
            if (user != null)
            {
                HttpCookie cookie = FormsAuthentication.GetAuthCookie(user.Matricule, true);
                WebOperationContext.Current.OutgoingResponse.Headers[HttpResponseHeader.SetCookie] = string.Format("{0}={1}; Path=/",cookie.Name, user.TicketAuth);
                return r;
            }
            r.Code = 2;
            r.Message = "Impossible de vous identifier.";
            return r;
        }

        /*public bool LoginWindows()
        {
            if (!string.IsNullOrEmpty(OperationContext.Current.ClaimsPrincipal.Identity.Name))
            {
                Portal.Bll.User user = Portal.Bll.Fabriques.Users.Instance.ObtenirUtilisateurSurWindowsAuth(OperationContext.Current.ClaimsPrincipal.Identity.Name.Replace("FR\\", ""));
                if (user != null)
                {
                    FormsAuthentication.SetAuthCookie(user.AuthCookie, true);
                    return true;
                }
            }
            return false;
        }*/

        public bool Logout()
        {
            FormsAuthentication.SignOut();
            return true;
        }
    }
}
