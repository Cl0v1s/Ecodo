class AlertManager {
    public static readonly Instance: AlertManager = new AlertManager();

    public Show(message: string): void {
        console.log(message);
    }

    public Error(message: string): void {
        console.error(message);
    }
}