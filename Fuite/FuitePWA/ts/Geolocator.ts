
/**
 * Classe utilitaire permettant de gérer la géolocalisation
 * */
class Geolocator
{
    /**
     * Singleton
     */
    public static readonly Instance: Geolocator = new Geolocator();

    /**
     * Disponible ? 
     */
    public enabled: boolean = false;

    /**
     * Lance la mise à jour régulière de la position et appelle la fonction func à intervalle régulier 
     * @param func Fonction à appeler lors de la mise à jour de la position
     * @returns Vrai si géolocalisation disponible, faux sinon
     */
    public SubscribeLocation(func): boolean {
        if (navigator.geolocation) {
            navigator.geolocation.watchPosition((position) => {
                this.enabled = true;
                func(position);
            });
            return true;
        }
        return false;
    }

    /**
     * Demande à l'utilisateur s'il est possible d'utiliser la géolocalisation sur son téléphone 
     * @param force = false Force la géololisation même si la fonction ne semble pas implémentée (inutile ?)
     * @returns Une promesse résolue lors de l'acceptation paer l'utilisateur, rejettée sinon
     */
    public askLocation(force = false) : Promise<any>
    {
        return new Promise<any>((resolve, reject) => {
            console.log(force);
            if (force || navigator.geolocation)
            {
                navigator.geolocation.getCurrentPosition((position) => {
                    resolve(position);
                });
            }
            else 
                reject();
        });
    }

}