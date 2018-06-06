<%@ Page Title="" Language="C#" MasterPageFile="~/Index.Master" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="FuiteAdmin.Default" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <a class="button" href="History.aspx">Voir tout les signalements</a>
    <div class="map" id="map"></div>
    <div runat="server" id="reportList">
    </div>
</asp:Content>
