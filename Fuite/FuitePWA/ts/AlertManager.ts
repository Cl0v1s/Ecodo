/// <reference path="Alertify.d.ts">

/**
 * Représente un bouton capable de changer de message afin de présenter une nouvelle informations à l'utilisateur en réponse à son action sur ledit bouton
 */
class AlertButton {

    private target: HTMLButtonElement;

    /**
     * Construit le bouton 
     * @param {string} target objet HTML à transformer en alerte Bouton
     */
    constructor(target: string) {
        this.target = document.querySelector(target);
    }

    /**
     * Affiche un message de succès
     * @param {string} message Message à afficher
     */
    public Success(message: string): void {
        this.Push(message, "success");
        console.log(message);
    }

    /**
     * Affiche un message d'erreur
     * @param {string} message Message à afficher
     */
    public Error(message: string): void {
        this.Push(message, "error");
        console.error(message);
    }

    /**
     * Modifie l'apprence du bouton en le faisant afficher un message et lance son animation
     * @param {string} message Message à afficher
     * @param {string} type Type de message (erreur ou succès)
     */
    private Push(message: string, type: string) {
        if (this.target == null || this.target.classList.contains("attention"))
            return;
        var content = this.target.querySelector("span");
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