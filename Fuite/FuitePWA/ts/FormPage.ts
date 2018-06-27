/// <reference path="Page.ts">

/**
 * G�re la page de formulaire permettant la construction effective dela requ�te de report
 */
class FormPage implements Page {

    /**
     * Bouton dans lequel afficher l'�tat de l'avancement de la requ�te au serveur
     */
    private button: AlertButton;

    /**
     * Peut on envoyer ? 
     */
    private ready: boolean = true;

    public GoTo() {
        this.button = new AlertButton("#submit");
        document.querySelector("#submit").addEventListener("click", (ev) => {
            if (this.CheckForm())
                this.Submit(<HTMLElement>ev.target);
        });
        Camera.Instance.Attach("#camera #picture");
    }

    /**
     * V�rifie les donn�es renseign�es dans le formulaire 
     * @returns vrai su formulaire valide, faux sinon
     */
    private CheckForm(): boolean {
        var pic = (<HTMLImageElement>document.querySelector("#picture")).src;
        if (pic.length <= 0) {
            this.button.Error("Vous devez prendre la fuite en photo avant de poursuivre.");
            return false;
        }
        App.Instance.report.Picture = pic;
        if (App.Instance.report.Latitude == null || App.Instance.report.Longitude == null) {
            this.button.Error("Vous devez autoriser la g�olocalisation pour pouvoir signaler une fuite.");
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

    /**
     * Envoie la requ�te de report
     * @param {HTMLElement} target bouton dans lequel afficher l'etat de la requete
     */
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