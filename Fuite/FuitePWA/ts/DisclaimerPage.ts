/// <reference path="Page.ts">

/**
 * Gère le comportement de la page d'avertissement lors du premier lancement de l'application
 */
class DisclaimerPage implements Page {

    public GoTo() {
        document.querySelector(".submit").addEventListener("click", () => {
            localStorage.setItem('first', 'false');
            PUSH({ url: 'app.html' });
        });
    }
   
}