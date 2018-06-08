<%@ Page Title="" Language="C#" MasterPageFile="~/Index.Master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="FuiteAdmin.Default" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link rel="stylesheet" href="Static/css/leaflet.css" />
    <script src="Static/js/leaflet.js"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <a class="button" href="History.aspx">Voir tout les signalements</a>
    <div class="map" id="map" style="height:600px"></div>
    <script>
        var map = L.map('map').setView([44.8369002,-0.576331], 12);
        //let map = L.map('map').setView([44, -0.5], 13);
        var OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	        maxZoom: 19,
	        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        });
        map.addLayer(OpenStreetMap_Mapnik);

        <% 
        foreach(var report in this.Reports)
        { 
            %>
                L.marker([<%= ((double)report.Latitude).ToString().Replace(",",".") %>, <%= ((double)report.Longitude).ToString().Replace(",",".") %>]).addTo(map)
                .bindPopup("<%= report.Date.ToString("dd/MM/yy hh:mm") %>");
            <%
        }
        %>

    </script>
    <div runat="server" id="reportList">
    </div>
</asp:Content>
