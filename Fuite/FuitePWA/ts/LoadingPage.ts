/// <reference path="Page.ts">

/**
 * Page gérant le comportement de l'interface présentant la page de chargement
 */
class LoadingPage implements Page {

    public GoTo() {
        setTimeout(() => {
            if (window.location.href.indexOf("index") != -1 && localStorage.getItem("first") == "false") {
                PUSH({ url: "app.html" });
            }
            else if (window.location.href.indexOf("index") != -1 && localStorage.getItem("first") != "false")
                PUSH({ url: "disclaimer.html" });
        }, 1000);
    }
}