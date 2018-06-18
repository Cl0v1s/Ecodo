function PUSH(opt) {
    App.Instance.SaveReport();
    var transition = ((<any>window).cordova && (<any>window).cordova.plugins && (<any>window).cordova.plugins.nativepagetransitions) ? (<any>window).cordova.plugins.nativepagetransitions : null;
    if (transition == null) {
        transition = ((<any>window).cordova && (<any>window).cordova.plugins && (<any>window).cordova.plugins.NativePageTransitions) ? (<any>window).cordova.plugins.NativePageTransitions : null;
    }
    if (transition == null) {
        transition = ( (<any>window).plugins && (<any>window).plugins.NativePageTransitions) ? (<any>window).plugins.NativePageTransitions : null;
    }
    if (transition == null) {
        transition = ((<any>window).plugins && (<any>window).plugins.nativepagetransitions) ? (<any>window).plugins.nativepagetransitions : null;
    }
    if (opt.url == null)
        throw new Error("Url must be set.");
    var options = {
        direction: 'up',
        duration: 500,
        slowdownfactor: 3,
        slidePixels: 20,
        iosdelay: 0,
        androiddelay: 0,
        fixedPixelsTop: 0,
        fixedPixelsBottom: 60
    };
    setTimeout(function () {
        window.location.href = opt.url;
    }, options.duration/10);
    transition.slide(options, function () {
    });
}