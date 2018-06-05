/// <reference path="Geolocator.ts">
/// <reference path="Report.ts">


class App {
    public static readonly Instance: App = new App();

    private static readonly Endpoint: string = "http://localhost:8000";

    private report: Report;
    private geolocEnabled: boolean = false;

    constructor() {
        window.addEventListener("load", () => { this.Attach(); this.Start() });
    }

    public Attach(): void {
        document.querySelector("#submit").addEventListener("click", () => { this.Submit(); })
    }

    public Start(): void {
        this.report = new Report();
        if (Geolocator.Instance.SubscribeLocation((p) => {
            this.report.UpdatePosition(p)
        }))
            this.geolocEnabled = true;
        else 
            AlertManager.Instance.Error("Vous devez autoriser la géolocalisation pour pouvoir signaler une fuite.");
    }

    public Submit(): void {
        if (this.geolocEnabled == false) {
            AlertManager.Instance.Error("Vous devez autoriser la géolocalisation pour pouvoir signaler une fuite.");
            return;
        }

        if (this.report == null || Report.IsValid(this.report) == false) {
            AlertManager.Instance.Error("Des données sont manquantes pour pouvoir signaler la fuite. Pouvez-vous réessayer s'il vous plaît ? :3");
            return;
        }

       fetch(App.Endpoint + "/Reports/AddReport", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                    "Origin": "aca"
                },
                body: JSON.stringify(this.report)
       }).then((response: any) => {
            return response.json();
       }, (error) => {
            AlertManager.Instance.Error("Une erreur réseau a eu lieu. Veuillez vérifier votre connexion à internet.");
       }).then((json) => {
            if (json.Code == 0)
                AlertManager.Instance.Show("Votre rapport de fuite a bien été pris en compte ! Merci beaucoup :D");
            else
                AlertManager.Instance.Error(json.Message);
            this.Start();
       });


        

    }
}