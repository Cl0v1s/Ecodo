/// <reference path="Page.ts">


class PicturePage implements Page {

    private button: AlertButton;

    public GoTo() {
        Camera.Instance.Attach("#camera #picture");
        this.button = new AlertButton("#submit");
        document.querySelector("#submit").addEventListener("click", () => {
            this.Next();
        });
    }

    private Next() {
        var pic = (<HTMLImageElement>document.querySelector("#picture")).src;
        if (pic.length <= 0) {
            this.button.Error("Vous devez prendre la fuite en photo avant de poursuivre.");
            return;
        }
        App.Instance.report.Picture = pic;
        if (App.Instance.report.Latitude == null || App.Instance.report.Longitude == null) {
            this.button.Error("Vous devez autoriser la géolocalisation pour pouvoir signaler une fuite.");
            return;
        }

        PUSH({
            url: "description.html"
        });
    }
}