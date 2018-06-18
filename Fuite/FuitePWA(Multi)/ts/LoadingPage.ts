/// <reference path="Page.ts">


class LoadingPage implements Page {

    public GoTo() {
        PUSH({
            url: "picture.html"
        });
    }
}