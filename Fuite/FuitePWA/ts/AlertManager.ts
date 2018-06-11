/// <reference path="Alertify.d.ts">
class AlertManager {
    public static readonly Instance: AlertManager = new AlertManager();

    private target: HTMLButtonElement;

    public Attach(target: string) {
        this.target = document.querySelector(target);
    }

    public Success(message: string): void {
        this.Push(message, "success");
        console.log(message);
    }


    public Error(message: string): void {
        this.Push(message, "error");
        console.error(message);
    }

    private Push(message: string, type: string) {
        if (this.target == null || this.target.classList.contains("attention"))
            return;
        var content = this.target.querySelector(".content");
        var saved = "Envoyer";
        content.innerHTML = message;
        this.target.classList.add("attention");
        this.target.classList.add(type);

        setTimeout(() => {
            this.target.classList.add("started");
        }, 10);

        setTimeout(() => {
            content.innerHTML = saved;
            this.target.classList.remove("attention");
            this.target.classList.remove(type);
            this.target.classList.remove("started");
        }, 10000);
    }
}