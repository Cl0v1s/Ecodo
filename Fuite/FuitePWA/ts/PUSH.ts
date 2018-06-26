function PUSH(opt) {
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
        direction: 'left',
        href: opt.url,
    };
    transition.slide(options, function () {
    });
    //window.location.href = opt.url;
}