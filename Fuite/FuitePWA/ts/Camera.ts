/// <reference path="LZString.d.ts">

/**
 * Classe utilitaire permettant d'intérragir avec l'appareil photo du téléphone
 **/
class Camera
{
    /**
     * Singleton
     */
    public static readonly Instance: Camera = new Camera();

    /**
     * Si la caméra est disponible
     */
    public enabled: boolean = false;

    /**
     * Objet image chargé d'afficher la photographie
     */
    private picture: HTMLImageElement;

    /**
     * Donnée de la photo en DATAURI
     */
    public data: string = null;

    /**
     * Attache l'instance à un élément DOM de l'interface
     * @param {string} picture Selecteur CSS de l'élement DOM à ammarer
     */
    public Attach(picture: string): void {
        this.picture = document.querySelector(picture);
        if (!(<any>navigator).camera) {
            this.enabled = false
            return;
        }
        this.enabled = true;
        this.picture.parentElement.addEventListener("click", () => {
            this.Capture();
        });

    }

    /**
     * Prend la photo et l'affiche dans l'élément picture renseigné 
     */
    public Capture(): void {
        var options = {
            quality: 20,
            destinationType: (<any>navigator).camera.DestinationType.DATA_URL,
            sourceType: 1,
            encodingType: 0,
        };
        (<any>navigator).camera.getPicture(
            (data) => {
                //var string = data;
                //var compressed = (<any>window).LZString.compress(string);
                this.picture.src = "data:image/jpeg;base64," + data;
                //this.data = compressed;
            },
            function () {}, options
        );
    }

}