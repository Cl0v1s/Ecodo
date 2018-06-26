﻿<%@ Page Title="" Language="C#" MasterPageFile="~/Index.Master" AutoEventWireup="true" CodeBehind="Details.aspx.cs" Inherits="FuiteAdmin.Details" %>


<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link rel="stylesheet" href="Static/css/vendor/leaflet.css" />
    <link rel="stylesheet" href="Static/css/views/Details.css" />
    <link rel="stylesheet" href="Static/css/views/ReportPicture.css" />
    <script src="Static/js/leaflet.js"></script>
    <script src="Static/js/lz-string.min.js"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <br />
    <div class="report-map" id="map" style="height: 280px">
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
    <div class="report-header  clearfix">
        <div class="round text-center">
            <span class="info id float-left">
                <label class="font-weight-bold">ID:</label>
                #<%= this.Report.Id %> 
            </span>

            <div class="info geolocation ">
                <label class="font-weight-bold">Géolocalisation:</label>
                <%= this.Report.Latitude+" "+this.Report.Longitude %>
            </div>

            <span class="float-right info date">
                <label class="font-weight-bold">Date:</label>
                <%= this.Report.Date.ToString("dd/MM/yy hh:mm") %>
            </span>

            <span class="info quantity">
                <label class="font-weight-bold">Signalement(s):</label>
                <%= this.Report.Quantity %>
            </span>
            <div>
                <label class="font-weight-bold">Description:</label>
                <p>
                    <%= String.IsNullOrWhiteSpace(this.Report.Description) == false ? this.Report.Description : "N/A" %>
                </p>
            </div>

            <hr />

            <div class="ip text-left clearfix">
                <label class="font-weight-bold">IP:</label><br />
                <%= this.Report.Ip %>
                <br /><br />
                <span class="ban float-right text-center">
                    <asp:CheckBox runat="server" ID="ban_check" Text="Supprimer tout le contenu de cet utilisateur depuis 24 heures" />
                    <asp:Button runat="server" ID="ban" CssClass="button" Text="Supprimer le signalement" OnClientClick="return confirm('Etes-vous sûr de vouloir supprimer ce contenu ?')" OnClick="ban_Click" />
                </span>

            </div>
            <hr />
            <div class="state text-left clearfix">
                <span class="form-group">
                    <label class="font-weight-bold" for="reportState">Statut:</label>
                    <select id="reportState" class="form-control" name="reportState" runat="server">
                        <option value="0">Nouveau
                        </option>
                        <option value="1">Affecté
                        </option>
                        <option value="2">Traité
                        </option>
                    </select>
                </span>
                <asp:Button runat="server" Text="Mettre à jour" CssClass="button mx-auto d-block" ID="updateState" OnClick="updateState_Click" />
            </div>


            <hr />

            <div class="report-picture">
                <div runat="server" id="ReportPictures" class="row justify-content-center">
                </div>
                <hr />
                <span class="">
                    <asp:CheckBox runat="server" ID="BanPicture_check" Text="Supprimer tout le contenu des utilisateurs concernés depuis 24 heures" />
                    <asp:Button runat="server" ID="BanPicture" CssClass="button" Text="Supprimer le(s) photographie(s) sélectionnées" OnClientClick="return confirm('Etes-vous sûr de vouloir supprimer ce contenu ?')" OnClick="BanPicture_Click"  />
                </span>
            </div>
        </div>
    </div>

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