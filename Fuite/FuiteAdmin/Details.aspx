<%@ Page Title="" Language="C#" MasterPageFile="~/Index.Master" AutoEventWireup="true" CodeBehind="Details.aspx.cs" Inherits="FuiteAdmin.Details" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
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

        <div class="report-map">

        </div>

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
    </div>
</asp:Content>
