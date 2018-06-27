/**
 * Classe utilitaire permettant de g�rer la g�olocalisation
 * */
class Geolocator {
    constructor() {
        /**
         * Disponible ?
         */
        this.enabled = false;
    }
    /**
     * Lance la mise � jour r�guli�re de la position et appelle la fonction func � intervalle r�gulier
     * @param func Fonction � appeler lors de la mise � jour de la position
     * @returns Vrai si g�olocalisation disponible, faux sinon
     */
    SubscribeLocation(func) {
        if (navigator.geolocation) {
            navigator.geolocation.watchPosition((position) => {
                this.enabled = true;
                func(position);
            });
            return true;
        }
        return false;
    }
    /**
     * Demande � l'utilisateur s'il est possible d'utiliser la g�olocalisation sur son t�l�phone
     * @param force = false Force la g�ololisation m�me si la fonction ne semble pas impl�ment�e (inutile ?)
     * @returns Une promesse r�solue lors de l'acceptation paer l'utilisateur, rejett�e sinon
     */
    askLocation(force = false) {
        return new Promise((resolve, reject) => {
            console.log(force);
            if (force || navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    resolve(position);
                });
            }
            else
                reject();
        });
    }
}
/**
 * Singleton
 */
Geolocator.Instance = new Geolocator();
/// <reference path="Geolocator.ts">
/// <reference path="Report.ts">
/// <reference path="Camera.ts">
/// <reference path="LoadingPage.ts">
/// <reference path="DisclaimerPage.ts">
/// <reference path="FormPage.ts">
/// <reference path="ThanksPage.ts">
/**
 * Point d'entrée de l'application, contrôle le déroulement général de l'exécution
 */
class App {
    /**
     * Construit une nouvelle application
     */
    constructor() {
        //this.report = new Report();
        if (App.DEBUG) {
            window.addEventListener("load", () => {
                this.Init().then(() => { this.Route(); });
            });
        }
        else {
            document.addEventListener("deviceready", () => { this.Init().then(() => { this.Route(); }); });
        }
    }
    /**
     * Initialise l'application en lancant la géolocalisation et désactivant le bouton retour
     * @returns Promesse résolue une fois le lancement terminé
     */
    Init() {
        return new Promise((resolve, reject) => {
            document.addEventListener("backbutton", function (e) {
                e.preventDefault();
            }, false);
            this.report = new Report();
            Geolocator.Instance.SubscribeLocation((p) => {
                App.Instance.report.UpdatePosition(p);
            });
            resolve();
        });
    }
    /**
     * Construit l'objet Page correspondant à l'interface actuellement affichée par l'application
     */
    Route() {
        if (window.location.href.indexOf("index.html") != -1)
            this.page = new LoadingPage();
        else if (window.location.href.indexOf("disclaimer.html") != -1)
            this.page = new DisclaimerPage();
        else if (window.location.href.indexOf("app.html") != -1)
            this.page = new FormPage();
        else if (window.location.href.indexOf("thanks.html") != -1) {
            this.page = new ThanksPage();
        }
        this.page.GoTo();
    }
}
/**
 * Adresse de l'API
 */
App.Endpoint = "http://212.234.77.116/RechercheFuite/ReportService.svc";
/**
 * Passer à true pour tester dans la navigateur. NE PAS LAISSER A TRUE LORS DE LA COMPILATION MOBILE
 */
App.DEBUG = false;
/**
 * Singleton
 */
App.Instance = new App();
/// <reference path="Alertify.d.ts">
/**
 * Repr�sente un bouton capable de changer de message afin de pr�senter une nouvelle informations � l'utilisateur en r�ponse � son action sur ledit bouton
 */
class AlertButton {
    /**
     * Construit le bouton
     * @param {string} target objet HTML � transformer en alerte Bouton
     */
    constructor(target) {
        this.target = document.querySelector(target);
    }
    /**
     * Affiche un message de succ�s
     * @param {string} message Message � afficher
     */
    Success(message) {
        this.Push(message, "success");
        console.log(message);
    }
    /**
     * Affiche un message d'erreur
     * @param {string} message Message � afficher
     */
    Error(message) {
        this.Push(message, "error");
        console.error(message);
    }
    /**
     * Modifie l'apprence du bouton en le faisant afficher un message et lance son animation
     * @param {string} message Message � afficher
     * @param {string} type Type de message (erreur ou succ�s)
     */
    Push(message, type) {
        if (this.target == null || this.target.classList.contains("attention"))
            return;
        var content = this.target.querySelector("span");
        var saved = "Envoyer";
        content.innerHTML = message;
        this.target.classList.add("attention");
        this.target.classList.add(type);
        setTimeout(() => {
            this.target.classList.add("started");
        }, 10);
        setTimeout(() => {
            content.innerHTML = saved;
            this.target.classList.remove("attention");
            this.target.classList.remove(type);
            this.target.classList.remove("started");
        }, 10000);
    }
}
/**
 * Repr�sente une requ�te de cr�ation d'un nouveau report
 */
class Report {
    /**
     * COnstruction de la req�ete � partir d'un objet pr�-existant
     * @param obj = null
     */
    constructor(obj = null) {
        this.Latitude = null;
        this.Longitude = null;
        this.Description = null;
        this.Picture = null;
        if (obj == null)
            return;
        this.Latitude = obj.Latitude;
        this.Longitude = obj.Longitude;
        this.Description = obj.Description;
        this.Picture = obj.Picture;
    }
    /**
     * Retourne si la requete est valide
     * @param {Report} report Requete � tester
     * @returns Vrai si valide, faux sinon
     */
    static IsValid(report) {
        if (report.Latitude == null || report.Longitude == null || report.Picture == null)
            return false;
        return true;
    }
    /**
     * Met � jour la position du report courant
     * @param position Objet de g�olocation contenant les coordonn�es g�od�siques.
     */
    UpdatePosition(position) {
        this.Latitude = position.coords.latitude;
        this.Longitude = position.coords.longitude;
        console.log("Updated");
    }
    /**
     * R�cup�re les donn�es de formulaires associ�es � ce report
     * @returns Les donn�es de formulaire
     */
    FormData() {
        let data = new FormData();
        data.append("latitude", this.Latitude.toString());
        data.append("longitude", this.Longitude.toString());
        data.append("description", this.Description);
        data.append("picture", this.Picture);
        return data;
    }
}
/// <reference path="LZString.d.ts">
/**
 * Classe utilitaire permettant d'int�rragir avec l'appareil photo du t�l�phone
 **/
class Camera {
    constructor() {
        /**
         * Si la cam�ra est disponible
         */
        this.enabled = false;
        /**
         * Donn�e de la photo en DATAURI
         */
        this.data = null;
    }
    /**
     * Attache l'instance � un �l�ment DOM de l'interface
     * @param {string} picture Selecteur CSS de l'�lement DOM � ammarer
     */
    Attach(picture) {
        this.picture = document.querySelector(picture);
        if (!navigator.camera) {
            this.enabled = false;
            return;
        }
        this.enabled = true;
        this.picture.parentElement.addEventListener("click", () => {
            this.Capture();
        });
    }
    /**
     * Prend la photo et l'affiche dans l'�l�ment picture renseign�
     */
    Capture() {
        var options = {
            quality: 20,
            destinationType: navigator.camera.DestinationType.DATA_URL,
            sourceType: 1,
            encodingType: 0,
        };
        navigator.camera.getPicture((data) => {
            //var string = data;
            //var compressed = (<any>window).LZString.compress(string);
            this.picture.src = "data:image/jpeg;base64," + data;
            //this.data = compressed;
        }, function () { }, options);
    }
}
/**
 * Singleton
 */
Camera.Instance = new Camera();
/**
 * Permet de transiter avec animation de page en page
 * @param opt objet contenant les param�tres de la transition (notamment la page � laquelle l'application doit se rendre)
 */
function PUSH(opt) {
    var transition = (window.cordova && window.cordova.plugins && window.cordova.plugins.nativepagetransitions) ? window.cordova.plugins.nativepagetransitions : null;
    if (transition == null) {
        transition = (window.cordova && window.cordova.plugins && window.cordova.plugins.NativePageTransitions) ? window.cordova.plugins.NativePageTransitions : null;
    }
    if (transition == null) {
        transition = (window.plugins && window.plugins.NativePageTransitions) ? window.plugins.NativePageTransitions : null;
    }
    if (transition == null) {
        transition = (window.plugins && window.plugins.nativepagetransitions) ? window.plugins.nativepagetransitions : null;
    }
    if (opt.url == null)
        throw new Error("Url must be set.");
    var options = {
        direction: 'left',
        href: opt.url,
    };
    transition.slide(options, function () {
    });
    //window.location.href = opt.url;
}
/// <reference path="Page.ts">
/**
 * Page g�rant le comportement de l'interface pr�sentant la page de chargement
 */
class LoadingPage {
    GoTo() {
        setTimeout(() => {
            if (window.location.href.indexOf("index") != -1 && localStorage.getItem("first") == "false") {
                PUSH({ url: "app.html" });
            }
            else if (window.location.href.indexOf("index") != -1 && localStorage.getItem("first") != "false")
                PUSH({ url: "disclaimer.html" });
        }, 1000);
    }
}
/// <reference path="Page.ts">
/**
 * G�re le comportement de la page d'avertissement lors du premier lancement de l'application
 */
class DisclaimerPage {
    GoTo() {
        document.querySelector(".submit").addEventListener("click", () => {
            localStorage.setItem('first', 'false');
            PUSH({ url: 'app.html' });
        });
    }
}
/// <reference path="Page.ts">
/**
 * G�re la page de formulaire permettant la construction effective dela requ�te de report
 */
class FormPage {
    constructor() {
        /**
         * Peut on envoyer ?
         */
        this.ready = true;
    }
    GoTo() {
        this.button = new AlertButton("#submit");
        document.querySelector("#submit").addEventListener("click", (ev) => {
            if (this.CheckForm())
                this.Submit(ev.target);
        });
        Camera.Instance.Attach("#camera #picture");
    }
    /**
     * V�rifie les donn�es renseign�es dans le formulaire
     * @returns vrai su formulaire valide, faux sinon
     */
    CheckForm() {
        var pic = document.querySelector("#picture").src;
        if (pic.length <= 0) {
            this.button.Error("Vous devez prendre la fuite en photo avant de poursuivre.");
            return false;
        }
        App.Instance.report.Picture = pic;
        if (App.Instance.report.Latitude == null || App.Instance.report.Longitude == null) {
            this.button.Error("Vous devez autoriser la g�olocalisation pour pouvoir signaler une fuite.");
            return false;
        }
        var desc = document.querySelector("#description").value;
        App.Instance.report.Description = desc;
        var rgpd = document.querySelector("#rgpd");
        if (rgpd.checked == false) {
            rgpd.parentElement.classList.add("attention");
            setTimeout(() => {
                rgpd.parentElement.classList.remove("attention");
            }, 1000);
            this.button.Error("Vous devez confirmer votre consentement en cochant la case ci-dessus !");
            return false;
        }
        return true;
    }
    /**
     * Envoie la requ�te de report
     * @param {HTMLElement} target bouton dans lequel afficher l'etat de la requete
     */
    Submit(target) {
        if (this.ready == false)
            return;
        this.ready = false;
        var button = new AlertButton("#submit");
        target.classList.remove("clickable");
        fetch(App.Endpoint + "/AddReport", {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify(App.Instance.report),
        }).then((response) => {
            return response.json();
        }, (error) => {
            target.classList.add("clickable");
            this.ready = true;
            this.button.Error("Une erreur r�seau a eu lieu. Veuillez v�rifier votre connexion � internet.");
        }).then((json) => {
            target.classList.add("clickable");
            this.ready = true;
            if (json.Code == 0)
                PUSH({ url: "thanks.html" });
            else
                button.Error(json.Message);
        });
    }
}
/// <reference path="Page.ts">
/**
 * Page controlant la logique derri�re la page de remerciement
 */
class ThanksPage {
    GoTo() {
        document.querySelector(".submit").addEventListener("click", () => {
            PUSH({ url: 'app.html' });
        });
    }
}
//# sourceMappingURL=index.js.map