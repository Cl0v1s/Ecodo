/// <reference path="Geolocator.ts">
/// <reference path="Report.ts">
/// <reference path="Camera.ts">

class App {
    public static readonly Instance: App = new App();

    private static readonly Endpoint: string = "http://localhost:8000";

    private report: Report;

    constructor() {
        window.addEventListener("load", () => { this.Attach(); this.Start() });
    }

    public Attach(): void {
        document.querySelector("#submit").addEventListener("click", (ev: Event) => { this.Submit(<HTMLElement>ev.target); });
        document.querySelector("#submit span").addEventListener("click", (ev: Event) => { this.Submit((<HTMLElement>ev.target).parentElement); });
        Camera.Instance.Attach("#camera video", "#camera canvas")
    }

    public Start(): void {
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
            AlertManager.Instance.Error("Des données sont manquantes pour pouvoir signaler la fuite. Pouvez-vous réessayer s'il vous plaît ? :3");
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
        this.report.Picture = Camera.Instance.Capture();
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