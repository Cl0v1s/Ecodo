interface Alertify {
    log(msg: string);
    error(msg: string);
    success(msg: string);
    logPosition(pos: string);
}

declare var alertify: Alertify;