class Geolocator {
    constructor() {
        this.enabled = false;
    }
    SubscribeLocation(func) {
        if (navigator.geolocation) {
            navigator.geolocation.watchPosition((position) => {
                this.enabled = true;
                func(position);
            });
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
        this.ready = false;
        alert("start");
        if (App.DEBUG) {
            alert("load");
            window.addEventListener("load", () => { this.Launch(); });
        }
        else {
            alert("ready");
            document.addEventListener("deviceready", () => { this.Launch(); });
        }
    }
    Launch() {
        alert("launch");
        if (this.ready)
            return;
        document.querySelector("#loading").classList.add("d-none");
        this.Attach();
        this.Start();
        this.ready = true;
        alert("launched");
    }
    Attach() {
        document.querySelector("#submit").addEventListener("click", (ev) => { this.Submit(ev.target); });
        document.querySelector("#submit span").addEventListener("click", (ev) => { this.Submit(ev.target.parentElement); });
        Camera.Instance.Attach("#camera #picture");
        AlertManager.Instance.Attach("#submit");
    }
    Start() {
        this.report = new Report();
        if (Geolocator.Instance.SubscribeLocation((p) => {
            this.report.UpdatePosition(p);
        }) == false)
            AlertManager.Instance.Error("Vous devez autoriser la géolocalisation pour pouvoir signaler une fuite.");
    }
    CheckForm() {
        if (Geolocator.Instance.enabled == false) {
            AlertManager.Instance.Error("Vous devez autoriser la géolocalisation pour pouvoir signaler une fuite.");
            return false;
        }
        if (Camera.Instance.enabled == false) {
            AlertManager.Instance.Error("Vous devez autoriser l'accès à la caméra pour pouvoir signaler une fuite.");
            return false;
        }
        if (this.report == null || Report.IsValid(this.report) == false) {
            if (this.report.Picture == null)
                AlertManager.Instance.Error("Votre signalement doit inclure une photo de la fuite. :/");
            if (this.report.Latitude == null || this.report.Longitude == null)
                AlertManager.Instance.Error("Il y a un problème avec les coordonnées GPS... :/");
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
    FillReport() {
        this.report.Picture = document.querySelector("#picture").src;
        this.report.Description = document.querySelector("#description").value;
        console.log(this.report);
    }
    Submit(target) {
        this.FillReport();
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
            AlertManager.Instance.Error("Une erreur réseau a eu lieu. Veuillez vérifier votre connexion à internet.");
        }).then((json) => {
            target.classList.add("clickable");
            if (json.Code == 0)
                AlertManager.Instance.Success("Votre rapport de fuite a bien été pris en compte ! Merci beaucoup :D");
            else
                AlertManager.Instance.Error(json.Message);
            this.Start();
        });
    }
}
App.DEBUG = false;
App.Instance = new App();
App.Endpoint = "http://localhost:8000";
/// <reference path="Alertify.d.ts">
class AlertManager {
    Attach(target) {
        this.target = document.querySelector(target);
    }
    Success(message) {
        this.Push(message, "success");
        console.log(message);
    }
    Error(message) {
        this.Push(message, "error");
        console.error(message);
    }
    Push(message, type) {
        if (this.target == null || this.target.classList.contains("attention"))
            return;
        var content = this.target.querySelector(".content");
        var saved = "Envoyer";
        content.innerHTML = message;
        this.target.classList.add("attention");
        this.target.classList.add(type);
        setTimeout(() => {
            this.target.classList.add("started");
        }, 10);
        setTimeout(() => {
            content.innerHTML = saved;
            this.target.classList.remove("attention");
            this.target.classList.remove(type);
            this.target.classList.remove("started");
        }, 10000);
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
        if (report.Picture.indexOf("base64") == -1)
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
    constructor() {
        this.enabled = false;
    }
    Attach(picture) {
        this.picture = document.querySelector(picture);
        if (!navigator.camera) {
            this.enabled = false;
            alert("no camera");
            return;
        }
        this.enabled = true;
        this.picture.parentElement.addEventListener("click", () => {
            this.Capture();
        });
    }
    Capture() {
        alert("capture");
        var options = {
            quality: 50,
            destinationType: navigator.camera.DestinationType.DATA_URL,
            sourceType: 1,
            encodingType: 0,
        };
        navigator.camera.getPicture((data) => {
            this.picture.src = "data:image/jpeg;base64," + data;
        }, function () { }, options);
    }
}
Camera.Instance = new Camera();
//# sourceMappingURL=index.js.map