/// <reference path="Page.ts">


class DisclaimerPage implements Page {

    public GoTo() {
        document.querySelector(".submit").addEventListener("click", () => {
            localStorage.setItem('first', 'false');
            PUSH({ url: 'app.html' });
        });
    }
   
}