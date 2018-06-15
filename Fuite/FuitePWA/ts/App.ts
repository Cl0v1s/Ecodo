/// <reference path="Geolocator.ts">
/// <reference path="Report.ts">
/// <reference path="Camera.ts">


class App {

    public static readonly Endpoint: string = "http://212.234.77.116/RechercheFuite/ReportService.svc";
    public static Local: string = ".";

    public static readonly DEBUG: boolean = false;
    public report: Report;


    public static readonly Instance: App = new App();


    constructor() {
        //this.report = new Report();
        if (App.DEBUG) {
            window.addEventListener("load", () => {
                this.Init().then(() => { this.Route() }) });
        }
        else {
            document.addEventListener("deviceready", () => { this.Init().then(() => { this.Route() }) });
        }
        window.addEventListener("push", () => { this.Route() });
    }

    private Init(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.report = new Report();
            Geolocator.Instance.SubscribeLocation((p) => {
                App.Instance.report.UpdatePosition(p)
            });
            if (App.DEBUG == false) {
                var httpd = ((<any>window).cordova && (<any>window).cordova.plugins && (<any>window).cordova.plugins.CorHttpd) ? (<any>window).cordova.plugins.CorHttpd : null;
                var options = {
                    www_root: '', // relative path to app's www directory
                    port: 8055,
                    localhost_only: true
                };
                alert(httpd);
                httpd.startServer(options,(url) => {
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

    private Route() {
        var screen: Page;
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