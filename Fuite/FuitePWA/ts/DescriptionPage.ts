/// <reference path="Page.ts">

class DescriptionPage implements Page {

    private button: AlertButton;

    public GoTo() {
        this.button = new AlertButton("#submit");
        document.querySelector("#submit").addEventListener("click", () => {
            this.Next();
        });
    }

    private Next() {
        var desc = (<HTMLTextAreaElement>document.querySelector("#description")).value;
        App.Instance.report.Description = desc;
        PUSH({
            url: App.Local + "/rgpd.html"
        });
    }
}