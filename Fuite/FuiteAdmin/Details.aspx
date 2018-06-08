<%@ Page Title="" Language="C#" MasterPageFile="~/Index.Master" AutoEventWireup="true" CodeBehind="Details.aspx.cs" Inherits="FuiteAdmin.Details" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link rel="stylesheet" href="Static/css/vendor/leaflet.css" />
    <script src="Static/js/leaflet.js"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <div class="report-header text-center">
        <span class="round info float-left ip">
            <label class="font-weight-bold">IP:</label> <%= this.Report.Ip %>
        </span>
        <span class="round info ip">
            <label class="font-weight-bold">ID:</label> #<%= this.Report.Id %>
        </span>
        <span class="round float-right info date">
            <label class="font-weight-bold">Date:</label> <%= this.Report.Date.ToString("dd/MM/yy hh:mm") %>
        </span>
    </div>
    <div class="report-picture">
        <img class="picture" src="<%= this.Report.Picture %>"
    </div>
    <div class="report-details text-center">
        <br />
        <span class="round info d-inline-block geolocation">
            <label class="font-weight-bold">Géolocalisation:</label> <%= this.Report.Latitude+" "+this.Report.Longitude %>
        </span>

        <span class="info ban">
            <asp:Button runat="server" ID="ban" CssClass="button" Text="Bannir cet utilisateur" OnClientClick="return confirm('Etes-vous sûr de vouloir bannir cet utilisateur ?')" OnClick="ban_Click" />
        </span>
    </div>

    <div class="report-map" id="map" style="height:280px">
    </div>
    <script>
        var map = L.map('map').setView([<%= ((double)this.Report.Latitude).ToString().Replace(",",".") %>, <%= ((double)this.Report.Longitude).ToString().Replace(",",".") %>], 16);
        //let map = L.map('map').setView([44, -0.5], 13);
        var OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	        maxZoom: 19,
	        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        });
        map.addLayer(OpenStreetMap_Mapnik);
        L.marker([<%= ((double)this.Report.Latitude).ToString().Replace(",",".") %>, <%= ((double)this.Report.Longitude).ToString().Replace(",",".") %>]).addTo(map)
        .bindPopup('Signalement de fuite');
    </script>
            <span class="round info state">
            <select id="reportState" name="reportState" runat="server">
                <option value="0">
                    Nouveau
                </option>
                <option value="1">
                    Affecté
                </option>
                <option value="2">
                    Traité
                </option>
            </select>
            <asp:Button runat="server" Text="Mettre à jour" CssClass="button" ID="updateState" OnClick="updateState_Click" />
        </span>
    <div class="report-history round mx-auto w-75">
        <table class="table">
            <thead class="thead-light">
                <tr>
                    <th scope="col">Date</th>
                    <th scope="col">Etat</th>
                    <th scope="col">Opérateur</th>
                </tr>
            </thead>
            <tbody runat="server" id="reportHistory">
            </tbody>
        </table>
    </div>
</asp:Content>
