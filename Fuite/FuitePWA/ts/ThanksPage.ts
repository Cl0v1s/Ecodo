/// <reference path="Page.ts">

/**
 * Page controlant la logique derri�re la page de remerciement
 */
class ThanksPage implements Page {


    public GoTo() {
        document.querySelector(".submit").addEventListener("click", () => {
            PUSH({ url: 'app.html' });
        });
    }


}