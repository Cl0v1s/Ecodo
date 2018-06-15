/// <reference path="Page.ts">


class LoadingPage implements Page {

    public GoTo() {
        alert(App.Local + "/picture.html");
        fetch(App.Local + "/picture.html").then((response) => {
            return response.text();
        }, (error) => {
            alert(error);
        }).then((txt) => {
            alert(txt);
        });
        PUSH({
            url: App.Local + "/picture.html"
        });
    }
}