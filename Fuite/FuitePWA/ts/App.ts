/// <reference path="Geolocator.ts">
/// <reference path="Report.ts">
/// <reference path="Camera.ts">


class App {

    public static readonly Endpoint: string = "http://212.234.77.116/RechercheFuite/ReportService.svc";

    public static readonly DEBUG: boolean = true;
    public report: Report;

    private ready: boolean = true;
    private button: AlertButton;

    public static readonly Instance: App = new App();


    constructor() {
        //this.report = new Report();
        if (App.DEBUG) {
            window.addEventListener("load", () => {
                this.Init().then(() => { this.Run() }) });
        }
        else {
            document.addEventListener("deviceready", () => { this.Init().then(() => { this.Run() }) });
        }
    }


    private Init(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.report = new Report();
            Geolocator.Instance.SubscribeLocation((p) => {
                App.Instance.report.UpdatePosition(p)
            });
            resolve();
        });
    }

    private FirstRun() {
        if (window.location.href.indexOf("index") != -1 && localStorage.getItem("first") == "false") {
            PUSH({ url: "app.html" });
        }
        localStorage.setItem("first", "false");
    }

    private Run() {

        this.FirstRun();

        this.button = new AlertButton("#submit");
        document.querySelector("#submit").addEventListener("click", (ev) => {
            if (this.CheckForm())
                this.Submit(<HTMLElement>ev.target);
        });
        Camera.Instance.Attach("#camera #picture");
    }

    private CheckForm(): boolean {
        var pic = (<HTMLImageElement>document.querySelector("#picture")).src;
        if (pic.length <= 0) {
            this.button.Error("Vous devez prendre la fuite en photo avant de poursuivre.");
            return false;
        }
        App.Instance.report.Picture = pic;
        if (App.Instance.report.Latitude == null || App.Instance.report.Longitude == null) {
            this.button.Error("Vous devez autoriser la géolocalisation pour pouvoir signaler une fuite.");
            return false;
        }

        var desc = (<HTMLTextAreaElement>document.querySelector("#description")).value;
        App.Instance.report.Description = desc;

        var rgpd = (<HTMLInputElement>document.querySelector("#rgpd"));
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

    public Submit(target: HTMLElement): void {
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
            this.button.Error("Une erreur réseau a eu lieu. Veuillez vérifier votre connexion à internet.");
        }).then((json) => {
            target.classList.add("clickable");
            this.ready = true;
            if (json.Code == 0)
                button.Success(json.Message);
            else
                button.Error(json.Message);
        });
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