class Report {
    public Latitude: number = null;
    public Longitude: number = null; 
    public Description: string = null;
    public Picture: string = null;

    public Report() {

    }

    public static IsValid(report: Report) {
        if (report.Latitude == null || report.Longitude == null || report.Picture == null)
            return false;
        if (report.Picture.indexOf("base64") == -1)
            return false;
        return true;
    }

    public UpdatePosition(position): void {
        this.Latitude = position.coords.latitude;
        this.Longitude = position.coords.longitude;
        console.log("Updated");
    }

    public FormData(): FormData {
        let data: FormData = new FormData();
        data.append("latitude", this.Latitude.toString());
        data.append("longitude", this.Longitude.toString());
        data.append("description", this.Description);
        data.append("picture", this.Picture);
        return data;
    }

}