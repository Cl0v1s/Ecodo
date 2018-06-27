
/**
 * Classe utilitaire permettant de g�rer la g�olocalisation
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
     * Lance la mise � jour r�guli�re de la position et appelle la fonction func � intervalle r�gulier 
     * @param func Fonction � appeler lors de la mise � jour de la position
     * @returns Vrai si g�olocalisation disponible, faux sinon
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
     * Demande � l'utilisateur s'il est possible d'utiliser la g�olocalisation sur son t�l�phone 
     * @param force = false Force la g�ololisation m�me si la fonction ne semble pas impl�ment�e (inutile ?)
     * @returns Une promesse r�solue lors de l'acceptation paer l'utilisateur, rejett�e sinon
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