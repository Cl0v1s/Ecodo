/// <reference path="Page.ts">


class ThanksPage implements Page {


    public GoTo() {
        document.querySelector(".submit").addEventListener("click", () => {
            PUSH({ url: 'app.html' });
        });
    }


}