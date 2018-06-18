class Geolocator
{
    public static readonly Instance: Geolocator = new Geolocator();


    public enabled: boolean = false;

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