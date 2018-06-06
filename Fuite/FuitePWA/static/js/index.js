class Geolocator {
    SubscribeLocation(func) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(func);
            return true;
        }
        return false;
    }
    askLocation(force = false) {
        return new Promise((resolve, reject) => {
            console.log(force);
            if (force || navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    resolve(position);
                });
            }
            else
                reject();
        });
    }
}
Geolocator.Instance = new Geolocator();
/// <reference path="Geolocator.ts">
/// <reference path="Report.ts">
/// <reference path="Camera.ts">
class App {
    constructor() {
        this.geolocEnabled = false;
        window.addEventListener("load", () => { this.Attach(); this.Start(); });
    }
    Attach() {
        document.querySelector("#submit").addEventListener("click", (ev) => { this.Submit(ev.target); });
        document.querySelector("#submit span").addEventListener("click", (ev) => { this.Submit(ev.target.parentElement); });
        Camera.Instance.Attach("#camera video", "#camera canvas");
    }
    Start() {
        this.report = new Report();
        if (Geolocator.Instance.SubscribeLocation((p) => {
            this.report.UpdatePosition(p);
        }))
            this.geolocEnabled = true;
        else
            AlertManager.Instance.Error("Vous devez autoriser la g�olocalisation pour pouvoir signaler une fuite.");
    }
    CheckForm() {
        if (this.geolocEnabled == false) {
            AlertManager.Instance.Error("Vous devez autoriser la g�olocalisation pour pouvoir signaler une fuite.");
            return false;
        }
        if (this.report == null || Report.IsValid(this.report) == false) {
            AlertManager.Instance.Error("Des donn�es sont manquantes pour pouvoir signaler la fuite. Pouvez-vous r�essayer s'il vous pla�t ? :3");
            return false;
        }
        let rgpd = document.querySelector("#rgpd");
        if (rgpd.checked == false) {
            rgpd.parentElement.classList.remove("attention");
            setTimeout(() => {
                rgpd.parentElement.classList.add("attention");
            }, 50);
            return false;
        }
        return true;
    }
    Submit(target) {
        this.report.Picture = Camera.Instance.Capture();
        console.log(this.report);
        if (this.CheckForm() == false)
            return;
        target.classList.remove("clickable");
        fetch(App.Endpoint + "/Reports/AddReport", {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify(this.report),
        }).then((response) => {
            return response.json();
        }, (error) => {
            target.classList.add("clickable");
            AlertManager.Instance.Error("Une erreur r�seau a eu lieu. Veuillez v�rifier votre connexion � internet.");
        }).then((json) => {
            target.classList.add("clickable");
            if (json.Code == 0)
                AlertManager.Instance.Show("Votre rapport de fuite a bien �t� pris en compte ! Merci beaucoup :D");
            else
                AlertManager.Instance.Error(json.Message);
            this.Start();
        });
    }
}
App.Instance = new App();
App.Endpoint = "http://localhost:8000";
class AlertManager {
    Show(message) {
        console.log(message);
    }
    Error(message) {
        console.error(message);
    }
}
AlertManager.Instance = new AlertManager();
class Report {
    constructor() {
        this.Latitude = null;
        this.Longitude = null;
        this.Description = null;
        this.Picture = null;
    }
    Report() {
    }
    static IsValid(report) {
        if (report.Latitude == null || report.Longitude == null || report.Picture == null)
            return false;
        return true;
    }
    UpdatePosition(position) {
        this.Latitude = position.coords.latitude;
        this.Longitude = position.coords.longitude;
        console.log("Updated");
    }
    FormData() {
        let data = new FormData();
        data.append("latitude", this.Latitude.toString());
        data.append("longitude", this.Longitude.toString());
        data.append("description", this.Description);
        data.append("picture", this.Picture);
        return data;
    }
}
class Camera {
    Attach(videot, canvast) {
        let streaming = false;
        this.video = document.querySelector(videot);
        this.canvas = document.querySelector(canvast);
        let video = this.video;
        let canvas = this.canvas;
        navigator.getMedia = (navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia);
        let width = 320;
        let height = 0;
        navigator.getMedia({
            video: true,
            audio: false
        }, function (stream) {
            if (navigator.mozGetUserMedia) {
                video.mozSrcObject = stream;
            }
            else {
                var vendorURL = window.URL || window.webkitURL;
                video.srcObject = stream;
            }
            video.play();
        }, function (err) {
            console.log("An error occured! " + err);
        });
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
    Capture() {
        let width = parseInt(this.video.getAttribute("width"));
        let height = parseInt(this.video.getAttribute("height"));
        this.canvas.getContext('2d').drawImage(this.video, 0, 0, width, height);
        return this.canvas.toDataURL('image/png');
    }
}
Camera.Instance = new Camera();
//# sourceMappingURL=index.js.map