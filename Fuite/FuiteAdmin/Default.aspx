<%@ Page Title="" Language="C#" MasterPageFile="~/Index.Master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="FuiteAdmin.Default" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link rel="stylesheet" href="Static/css/vendor/leaflet.css" />
    <link rel="stylesheet" href="Static/css/views/ReportItem.css" />
    <link rel="stylesheet" href="Static/css/views/Default.css" />
    <script src="Static/js/leaflet.js"></script>
    <script src="Static/js/MarkerHighlighter.js"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <div class="map" id="map"></div>
    <script>
        var map = L.map('map').setView([44.8369002,-0.576331], 12);
        //let map = L.map('map').setView([44, -0.5], 13);
        var OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	        maxZoom: 19,
	        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        });
        map.addLayer(OpenStreetMap_Mapnik);

        var markers = {};

        <% 
        foreach(var report in this.Reports)
        { 
            %>
            markers[<%= report.Id %>] = L.marker([<%= ((double)report.Latitude).ToString().Replace(",",".") %>, <%= ((double)report.Longitude).ToString().Replace(",",".") %>]);
            markers[<%= report.Id %>].addTo(map).bindPopup("#<%= report.Id %>  <%= report.Date.ToString("dd/MM/yy hh:mm") %>");
            markers[<%= report.Id %>].on("mouseover", function () {
                markers[<%= report.Id %>].openPopup();
            });
            markers[<%= report.Id %>].on("mouseout", function () {
                markers[<%= report.Id %>].closePopup();
            });
            markers[<%= report.Id %>].on("click", function () { window.location.href = "Details.aspx?id=<%= report.Id %>" });
            <%
        }
        %>

        MarkerHightlighter.Instance.SetMarkers(markers);

    </script>
    
    <label for="toggle-menu">
        <input type="checkbox" id="toggle-menu">
        <div id="menu">
            <a class="button" href="History.aspx">Voir tous les signalements</a>
            <div runat="server" id="reportList">
            </div>
        </div>
     </label>
</asp:Content>
