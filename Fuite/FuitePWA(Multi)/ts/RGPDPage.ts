class RGPDPage implements Page {
    private button: AlertButton;
    private ready: boolean = true;

    public GoTo() {
        this.button = new AlertButton("#submit");
        document.querySelector("#submit").addEventListener("click", () => {
            this.Send();
        });
    }

    private Send() {
        var rgpd = (<HTMLInputElement>document.querySelector("#rgpd"));
        if (rgpd.checked == false) {
            rgpd.parentElement.classList.add("attention");
            setTimeout(() => {
                rgpd.parentElement.classList.remove("attention");
            }, 1000);
            this.button.Error("Vous devez confirmer votre consentement en cochant la case ci-dessus !");
            return;
        }

        this.Submit(document.querySelector("#submit"));
    }

    public Submit(target: HTMLElement): void {
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
            this.button.Error(error);
            //this.button.Error("Une erreur réseau a eu lieu. Veuillez vérifier votre connexion à internet.");
            alert(error);
        }).then((json) => {
            target.classList.add("clickable");
            this.ready = true;
            if (json.Code == 0)
                this.button.Success("Votre rapport de fuite a bien été pris en compte ! Merci beaucoup :D");
            else
                this.button.Error(json.Message);
        });
    }
}