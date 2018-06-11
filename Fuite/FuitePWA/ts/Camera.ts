class Camera
{
    public static readonly Instance: Camera = new Camera();

    public enabled: boolean = false;
    private picture: HTMLImageElement;


    public Attach(picture: string): void {
        this.picture = document.querySelector(picture);
        if (!(<any>navigator).camera) {
            this.enabled = false;
            return;
        }
        this.enabled = true;
        this.picture = document.querySelector(picture);
        this.picture.addEventListener("click", () => {
            this.Capture();
        });

    }

    public Capture(): void {
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