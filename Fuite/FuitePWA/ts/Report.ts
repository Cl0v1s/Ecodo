
/**
 * Représente une requête de création d'un nouveau report
 */
class Report {
    public Latitude: number = null;
    public Longitude: number = null; 
    public Description: string = null;
    public Picture: string = null;

    /**
     * COnstruction de la reqûete à partir d'un objet pré-existant
     * @param obj = null
     */
    constructor(obj = null) {
        if (obj == null)
            return;
        this.Latitude = obj.Latitude;
        this.Longitude = obj.Longitude;
        this.Description = obj.Description;
        this.Picture = obj.Picture;
    }

    /**
     * Retourne si la requete est valide 
     * @param {Report} report Requete à tester
     * @returns Vrai si valide, faux sinon
     */
    public static IsValid(report: Report) {
        if (report.Latitude == null || report.Longitude == null || report.Picture == null)
            return false;
        return true;
    }

    /**
     * Met à jour la position du report courant
     * @param position Objet de géolocation contenant les coordonnées géodésiques.
     */
    public UpdatePosition(position): void {
        this.Latitude = position.coords.latitude;
        this.Longitude = position.coords.longitude;
        console.log("Updated");
    }

    /**
     * Récupère les données de formulaires associées à ce report
     * @returns Les données de formulaire 
     */
    public FormData(): FormData {
        let data: FormData = new FormData();
        data.append("latitude", this.Latitude.toString());
        data.append("longitude", this.Longitude.toString());
        data.append("description", this.Description);
        data.append("picture", this.Picture);
        return data;
    }

}