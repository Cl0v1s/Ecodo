/// <reference path="Geolocator.ts">
/// <reference path="Report.ts">
/// <reference path="Camera.ts">

class App {
    public static readonly DEBUG: boolean = false;
    public static readonly Instance: App = new App();

    private static readonly Endpoint: string = "http://localhost:8000";


    private report: Report;
    private ready: boolean = false;

    constructor() {
        alert("start");
        if (App.DEBUG) {
            alert("load");
            window.addEventListener("load", () => { this.Launch() });
        }
        else {
            alert("ready");
            document.addEventListener("deviceready", () => { this.Launch() });
        }
    }

    public Launch() {
        alert("launch");
        if (this.ready)
            return;
        document.querySelector("#loading").classList.add("d-none");
        this.Attach();
        this.Start();
        this.ready = true;
        alert("launched");
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
        this.report.Picture = (<HTMLImageElement>document.querySelector("#picture")).src;
        this.report.Description = (<HTMLTextAreaElement>document.querySelector("#description")).value;
        console.log(this.report);
    }


    public Submit(target: HTMLElement): void {
        this.FillReport();

        if (this.CheckForm() == false)
            return;

        target.classList.remove("clickable");
        fetch(App.Endpoint + "/Reports/AddReport", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                },
                body: JSON.stringify(this.report),
        }).then((response: any) => {
            return response.json();
            }, (error) => {
            target.classList.add("clickable");
            AlertManager.Instance.Error("Une erreur réseau a eu lieu. Veuillez vérifier votre connexion à internet.");
            }).then((json) => {
            target.classList.add("clickable");
            if (json.Code == 0)
                AlertManager.Instance.Success("Votre rapport de fuite a bien été pris en compte ! Merci beaucoup :D");
            else
                AlertManager.Instance.Error(json.Message);
            this.Start();
        });


        

    }
}