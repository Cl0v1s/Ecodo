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
        window.addEventListener("push", () => { this.Route(); });
    }
    Init() {
        return new Promise((resolve, reject) => {
            this.report = new Report();
            Geolocator.Instance.SubscribeLocation((p) => {
                App.Instance.report.UpdatePosition(p);
            });
            if (App.DEBUG == false) {
                var httpd = (window.cordova && window.cordova.plugins && window.cordova.plugins.CorHttpd) ? window.cordova.plugins.CorHttpd : null;
                var options = {
                    www_root: '',
                    port: 8055,
                    localhost_only: true
                };
                alert(httpd);
                httpd.startServer(options, (url) => {
                    App.Local = url;
                    resolve();
                }, (error) => {
                    alert(error);
                });
            }
            else
                resolve();
        });
    }
    Route() {
        var screen;
        if (window.location.href.indexOf("picture") != -1) {
            screen = new PicturePage();
        }
        else if (window.location.href.indexOf("description") != -1) {
            screen = new DescriptionPage();
        }
        else if (window.location.href.indexOf("rgpd") != -1)
            screen = new RGPDPage();
        else
            screen = new LoadingPage();
        screen.GoTo();
    }
}
App.Endpoint = "http://212.234.77.116/RechercheFuite/ReportService.svc";
App.Local = ".";
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
    constructor() {
        this.Latitude = null;
        this.Longitude = null;
        this.Description = null;
        this.Picture = null;
    }
    Report() {
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
/// <reference path="Page.ts">
class LoadingPage {
    GoTo() {
        alert(App.Local + "/picture.html");
        fetch(App.Local + "/picture.html").then((response) => {
            return response.text();
        }, (error) => {
            alert(error);
        }).then((txt) => {
            alert(txt);
        });
        PUSH({
            url: App.Local + "/picture.html"
        });
    }
}
/// <reference path="Page.ts">
class PicturePage {
    GoTo() {
        Camera.Instance.Attach("#camera #picture");
        this.button = new AlertButton("#submit");
        document.querySelector("#submit").addEventListener("click", () => {
            this.Next();
        });
    }
    Next() {
        var pic = document.querySelector("#picture").src;
        if (pic.length <= 0) {
            this.button.Error("Vous devez prendre la fuite en photo avant de poursuivre.");
            return;
        }
        App.Instance.report.Picture = pic;
        if (App.Instance.report.Latitude == null || App.Instance.report.Longitude == null) {
            this.button.Error("Vous devez autoriser la g�olocalisation pour pouvoir signaler une fuite.");
            return;
        }
        PUSH({
            url: App.Local + "/description.html"
        });
    }
}
/// <reference path="Page.ts">
class DescriptionPage {
    GoTo() {
        this.button = new AlertButton("#submit");
        document.querySelector("#submit").addEventListener("click", () => {
            this.Next();
        });
    }
    Next() {
        var desc = document.querySelector("#description").value;
        App.Instance.report.Description = desc;
        PUSH({
            url: App.Local + "/rgpd.html"
        });
    }
}
class RGPDPage {
    constructor() {
        this.ready = true;
    }
    GoTo() {
        this.button = new AlertButton("#submit");
        document.querySelector("#submit").addEventListener("click", () => {
            this.Send();
        });
    }
    Send() {
        var rgpd = document.querySelector("#rgpd");
        if (rgpd.checked == false) {
            rgpd.parentElement.classList.add("attention");
            setTimeout(() => {
                rgpd.parentElement.classList.remove("attention");
            }, 1000);
            this.button.Error("Vous devez confirmer votre consentement en cochant la case ci-dessus ! :)");
            return;
        }
        console.log(App.Instance.report);
        this.Submit(document.querySelector("#submit"));
    }
    Submit(target) {
        if (this.ready == false)
            return;
        this.ready = false;
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
            alert(error);
        }).then((json) => {
            target.classList.add("clickable");
            this.ready = true;
            if (json.Code == 0)
                this.button.Success("Votre rapport de fuite a bien �t� pris en compte ! Merci beaucoup :D");
            else
                this.button.Error(json.Message);
        });
    }
}
//# sourceMappingURL=index.js.map