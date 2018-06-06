class Camera
{
    public static readonly Instance: Camera = new Camera();

    private canvas: HTMLCanvasElement;
    private video: HTMLVideoElement;

    public Attach(videot: string, canvast : string): void {
        let streaming = false;
        this.video = document.querySelector(videot);
        this.canvas = document.querySelector(canvast);
        let video = this.video;
        let canvas = this.canvas;
        (<any>navigator).getMedia = (navigator.getUserMedia ||
            (<any>navigator).webkitGetUserMedia ||
            (<any>navigator).mozGetUserMedia ||
            (<any>navigator).msGetUserMedia);
        let width : number = 320;
        let height : number = 0;

        (<any>navigator).getMedia(
            {
                video: true,
                audio: false
            },
            function (stream) {
                if ((<any>navigator).mozGetUserMedia) {
                    (<any>video).mozSrcObject = stream;
                } else {
                    var vendorURL = window.URL || (<any>window).webkitURL;
                    video.srcObject = stream;
                }
                video.play();
            },
            function (err) {
                console.log("An error occured! " + err);
            }
        );

        video.addEventListener('canplay', function (ev) {
            if (!streaming) {
                height = video.videoHeight / (video.videoWidth / width);
                video.setAttribute('width', width.toString());
                video.setAttribute('height', height.toString());
                canvas.setAttribute('width', width.toString());
                canvas.setAttribute('height', height.toString());
                streaming = true;
            }
        }, false);
    }

    public Capture(): string {
        let width = parseInt(this.video.getAttribute("width"));
        let height = parseInt(this.video.getAttribute("height"));
        this.canvas.getContext('2d').drawImage(this.video, 0, 0, width, height);
        return this.canvas.toDataURL('image/png');
    }

}