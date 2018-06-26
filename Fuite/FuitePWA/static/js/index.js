class Geolocator {
    constructor() {
        this.enabled = false;
    }
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
Geolocator.Instance = new Geolocator();
/// <reference path="Geolocator.ts">
/// <reference path="Report.ts">
/// <reference path="Camera.ts">
/// <reference path="LoadingPage.ts">
/// <reference path="DisclaimerPage.ts">
/// <reference path="FormPage.ts">
/// <reference path="ThanksPage.ts">
class App {
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
App.Endpoint = "http://212.234.77.116/RechercheFuite/ReportService.svc";
App.DEBUG = false;
App.Instance = new App();
/*class App {
    private static readonly Endpoint: string = "http://212.234.77.116/RechercheFuite/ReportService.svc";
    //private static readonly Endpoint: string = "http://localhost:49280/ReportService.svc";
    
    public static readonly DEBUG: boolean = true;
    public static readonly Instance: App = new App();



    private report: Report;
    private ready: boolean = false;

    constructor() {
        if (App.DEBUG) {
            window.addEventListener("load", () => { this.Launch() });
        }
        else {
            document.addEventListener("deviceready", () => { this.Launch() });
        }
    }

    public Launch() {
        if (this.ready)
            return;
        document.querySelector("#loading").classList.add("d-none");
        this.Attach();
        this.Start();
        this.ready = true;
    }

    private Attach(): void {
        document.querySelector("#submit").addEventListener("click", (ev: Event) => { this.Submit(<HTMLElement>ev.target); });
        document.querySelector("#submit span").addEventListener("click", (ev: Event) => { this.Submit((<HTMLElement>ev.target).parentElement); });
        Camera.Instance.Attach("#camera #picture")
        AlertManager.Instance.Attach("#submit");
    }

    private Start(): void {
        this.report = new Report();
        if (Geolocator.Instance.SubscribeLocation((p) => {
            this.report.UpdatePosition(p)
        }) == false)
            AlertManager.Instance.Error("Vous devez autoriser la géolocalisation pour pouvoir signaler une fuite.");
    }

    private CheckForm(): boolean {


        if (Geolocator.Instance.enabled == false) {
            AlertManager.Instance.Error("Vous devez autoriser la géolocalisation pour pouvoir signaler une fuite.");
            return false;
        }

        if (Camera.Instance.enabled == false) {
            AlertManager.Instance.Error("Vous devez autoriser l'accès à la caméra pour pouvoir signaler une fuite.");
            return false;
        }

        if (this.report == null || Report.IsValid(this.report) == false) {
            if (this.report.Picture == null)
                AlertManager.Instance.Error("Votre signalement doit inclure une photo de la fuite. :/");
            if (this.report.Latitude == null || this.report.Longitude == null)
                AlertManager.Instance.Error("Il y a un problème avec les coordonnées GPS... :/");
            return false;
        }

        let rgpd: HTMLInputElement = document.querySelector("#rgpd");
        if (rgpd.checked == false) {
            rgpd.parentElement.classList.remove("attention");
            setTimeout(() => {
                rgpd.parentElement.classList.add("attention");
            }, 50);
            return false;
        }

        return true;
    }

    private FillReport(): void {
        var pic = (<HTMLImageElement>document.querySelector("#picture")).src;
        this.report.Picture = pic;
        this.report.Description = (<HTMLTextAreaElement>document.querySelector("#description")).value;
    }

    public Submit(target: HTMLElement): void {
        if (this.ready == false)
            return;
        this.ready = false;
        target.classList.remove("clickable");
        this.FillReport();
        if (this.CheckForm() == false) {
            target.classList.add("clickable");
            this.ready = true;
            return;
        }
        /*Compression
        var pic = this.report.Picture;
        pic = pic.replace("data:image/jpeg;base64,", "");
        this.report.Picture = window.LZString.compress(pic);
        fetch(App.Endpoint + "/AddReport", {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify(this.report),
        }).then((response) => {
            return response.json();
        }, (error) => {
            target.classList.add("clickable");
            this.ready = true;
            AlertManager.Instance.Error("Une erreur réseau a eu lieu. Veuillez vérifier votre connexion à internet.");
            alert(error);
        }).then((json) => {
            target.classList.add("clickable");
            this.ready = true;
            if (json.Code == 0)
                AlertManager.Instance.Success("Votre rapport de fuite a bien été pris en compte ! Merci beaucoup :D");
            else
                AlertManager.Instance.Error(json.Message);
            this.Start();
        });
    }
}*/ 
/// <reference path="Alertify.d.ts">
class AlertButton {
    constructor(target) {
        this.target = document.querySelector(target);
    }
    Success(message) {
        this.Push(message, "success");
        console.log(message);
    }
    Error(message) {
        this.Push(message, "error");
        console.error(message);
    }
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
class Report {
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
    static IsValid(report) {
        if (report.Latitude == null || report.Longitude == null || report.Picture == null)
            return false;
        return true;
    }
    UpdatePosition(position) {
        this.Latitude = position.coords.latitude;
        this.Longitude = position.coords.longitude;
        console.log("Updated");
    }
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
class Camera {
    constructor() {
        this.enabled = false;
        this.data = null;
    }
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
Camera.Instance = new Camera();
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
class DisclaimerPage {
    GoTo() {
        document.querySelector(".submit").addEventListener("click", () => {
            localStorage.setItem('first', 'false');
            PUSH({ url: 'app.html' });
        });
    }
}
/// <reference path="Page.ts">
class FormPage {
    constructor() {
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
class ThanksPage {
    GoTo() {
        document.querySelector(".submit").addEventListener("click", () => {
            PUSH({ url: 'app.html' });
        });
    }
}
//# sourceMappingURL=index.js.map