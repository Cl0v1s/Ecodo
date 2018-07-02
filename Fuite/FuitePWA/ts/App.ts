/// <reference path="Geolocator.ts">
/// <reference path="Report.ts">
/// <reference path="Camera.ts">


/// <reference path="LoadingPage.ts">
/// <reference path="DisclaimerPage.ts">
/// <reference path="FormPage.ts">
/// <reference path="ThanksPage.ts">

/**
 * Point d'entrée de l'application, contrôle le déroulement général de l'exécution 
 */
class App {

    /**
     * Adresse de l'API
     */
    public static readonly Endpoint: string = "http://212.234.77.116/RechercheFuite/ReportService.svc";

    /**
     * Passer à true pour tester dans la navigateur. NE PAS LAISSER A TRUE LORS DE LA COMPILATION MOBILE
     */
    public static readonly DEBUG: boolean = false;

    /**
     * Requête de report en cours de construction dans l'application 
     */
    public report: Report;

    /**
     * Page actuellement présentée par l'application
     */
    private page: Page;

    /**
     * Singleton
     */
    public static readonly Instance: App = new App();

    /**
     * Construit une nouvelle application
     */
    constructor() {
        //this.report = new Report();
        if (App.DEBUG) {
            window.addEventListener("load", () => {
                this.Init().then(() => { this.Route() }) });
        }
        else {
            document.addEventListener("deviceready", () => { this.Init().then(() => { this.Route() }) });
        }
    }

    /**
     * Initialise l'application en lancant la géolocalisation et désactivant le bouton retour
     * @returns Promesse résolue une fois le lancement terminé
     */
    private Init(): Promise<any> {
        return new Promise((resolve, reject) => {
            document.addEventListener("backbutton", function (e) {
                e.preventDefault();
                if ((<any>navigator).app) {
                    (<any>navigator).app.exitApp();
                } else if ((<any>navigator).device) {
                    (<any>navigator).device.exitApp();
                } else {
                    window.close();
                }
            }, false);
            this.report = new Report();
            Geolocator.Instance.SubscribeLocation((p) => {
                App.Instance.report.UpdatePosition(p)
            });
            resolve();
        });
    }

    /**
     * Construit l'objet Page correspondant à l'interface actuellement affichée par l'application
     */
    private Route(): void {
        if (window.location.href.indexOf("index.html") != -1)
            this.page = new LoadingPage();
        else if (window.location.href.indexOf("disclaimer.html") != -1)
            this.page = new DisclaimerPage();
        else if (window.location.href.indexOf("app.html") != -1)
            this.page = new FormPage();
        else if (window.location.href.indexOf("thanks.html") != -1) {
            this.page = new ThanksPage();
        }
        this.page.GoTo();
    }

    
}
