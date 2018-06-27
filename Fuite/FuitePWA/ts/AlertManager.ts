/// <reference path="Alertify.d.ts">

/**
 * Repr�sente un bouton capable de changer de message afin de pr�senter une nouvelle informations � l'utilisateur en r�ponse � son action sur ledit bouton
 */
class AlertButton {

    private target: HTMLButtonElement;

    /**
     * Construit le bouton 
     * @param {string} target objet HTML � transformer en alerte Bouton
     */
    constructor(target: string) {
        this.target = document.querySelector(target);
    }

    /**
     * Affiche un message de succ�s
     * @param {string} message Message � afficher
     */
    public Success(message: string): void {
        this.Push(message, "success");
        console.log(message);
    }

    /**
     * Affiche un message d'erreur
     * @param {string} message Message � afficher
     */
    public Error(message: string): void {
        this.Push(message, "error");
        console.error(message);
    }

    /**
     * Modifie l'apprence du bouton en le faisant afficher un message et lance son animation
     * @param {string} message Message � afficher
     * @param {string} type Type de message (erreur ou succ�s)
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