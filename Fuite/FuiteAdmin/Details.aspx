<%@ Page Title="" Language="C#" MasterPageFile="~/Index.Master" AutoEventWireup="true" CodeBehind="Details.aspx.cs" Inherits="FuiteAdmin.Details" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link rel="stylesheet" href="Static/css/leaflet.css" />
    <script src="Static/js/leaflet.js"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <div class="report-header">
        <asp:Label runat="server" CssClass="info ip" ID="reportIp"></asp:Label>
        <asp:Label runat="server" CssClass="info date" ID="reportDate"></asp:Label>
    </div>
    <div class="report-picture">
        <asp:Image runat="server" ID="reportPicture" />
    </div>
    <div class="report-details">
        <span class="info state">
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
            <asp:Button runat="server" Text="Mettre à jour" ID="updateState" OnClick="updateState_Click" />
        </span>

        <span class="info geolocation">
            <asp:Label runat="server" ID="reportGeolocation"></asp:Label>
        </span>

        <span class="info ban">
            <asp:Button runat="server" ID="ban" Text="Bannir cet utilisateur" OnClientClick="return confirm('Etes-vous sûr de vouloir bannir cet utilisateur ?')" OnClick="ban_Click" />
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

    <div class="report-history">
        <table>
            <thead>
                <tr>
                    <td>Date</td>
                    <td>Etat</td>
                    <td>Opérateur</td>
                </tr>
            </thead>
            <tbody runat="server" id="reportHistory">
            </tbody>
        </table>
    </div>
</asp:Content>
