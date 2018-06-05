using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;

namespace FuiteAPI
{
    // REMARQUE : vous pouvez utiliser la commande Renommer du menu Refactoriser pour changer le nom d'interface "IService1" à la fois dans le code et le fichier de configuration.
    [ServiceContract]
    public interface IAuthService
    {
        /// <summary>
        /// Permet à un employé de se connecter pour administrer le suivit des fuites
        /// </summary>
        /// <param name="username">Nom d'utilisateur</param>
        /// <param name="password">Mot de passe</param>
        /// <returns>True si connecté, False sinon</returns>
        [OperationContract]
        [WebGet]
        Result Login(string username, string password);

        /// <summary>
        /// Permet à un employé de se connecter pour administrer le suivit des fuites
        /// </summary>
        /// <param name="guid">Guide pour connexion automatique</param>
        /// <returns>True si connecté</returns>
        [OperationContract]
        [WebGet]
        bool LoginWindows();

        /// <summary>
        /// Permet à un employé de se déconnecter
        /// </summary>
        /// <returns>True si déconnecté</returns>
        [OperationContract]
        [WebGet]
        bool Logout();
    }

    [DataContract]
    public class Auth
    {
        [DataMember]
        public string Username
        {
            get; set;
        }

        [DataMember]
        public string Password
        {
            get;set;
        }
    }


    
}
