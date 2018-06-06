/// <reference path="Alertify.d.ts">
class AlertManager {
    public static readonly Instance: AlertManager = new AlertManager();

    public Success(message: string): void {
        alertify.logPosition("top right");
        alertify.success(message);
        console.log(message);
    }

    public Show(message: string): void {
        alertify.logPosition("top right");
        alertify.log(message);
        console.log(message);
    }

    public Error(message: string): void {
        alertify.logPosition("top right");
        alertify.error(message);
        console.error(message);
    }
}