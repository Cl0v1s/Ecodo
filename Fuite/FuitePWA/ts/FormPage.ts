/// <reference path="Page.ts">

class FormPage implements Page {

    private button: AlertButton;
    private ready: boolean = true;

    public GoTo() {
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
                PUSH({ url: "thanks.html" });
            else
                button.Error(json.Message);
        });
    }
}