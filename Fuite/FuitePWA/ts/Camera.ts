class Camera
{
    public static readonly Instance: Camera = new Camera();

    public enabled: boolean = false;
    private picture: HTMLImageElement;


    public Attach(picture: string): void {
        this.picture = document.querySelector(picture);
        if (!(<any>navigator).camera) {
            this.enabled = false
            alert("no camera");
            return;
        }
        this.enabled = true;
        this.picture.parentElement.addEventListener("click", () => {
            this.Capture();
        });

    }

    public Capture(): void {
        alert("capture");
        var options = {
            quality: 50,
            destinationType: (<any>navigator).camera.DestinationType.DATA_URL,
            sourceType: 1,
            encodingType: 0,
        };
        (<any>navigator).camera.getPicture(
            (data) => {
                this.picture.src = "data:image/jpeg;base64," + data;
            },
            function () {}, options
        );
    }

}