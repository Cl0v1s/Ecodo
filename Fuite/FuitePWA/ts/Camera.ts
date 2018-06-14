/// <reference path="LZString.d.ts">
class Camera
{
    public static readonly Instance: Camera = new Camera();

    public enabled: boolean = false;
    private picture: HTMLImageElement;
    public data: string = null;


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