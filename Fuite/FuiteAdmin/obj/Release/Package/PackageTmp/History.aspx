<%@ Page Title="" Language="C#" MasterPageFile="~/Index.Master" AutoEventWireup="true" CodeBehind="History.aspx.cs" Inherits="FuiteAdmin.History" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
    <link rel="stylesheet" href="Static/css/views/History.css" />
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <div class="alert alert-info text-center mx-auto w-50 mt-5">
        Pour rechercher un signalement, entrez le raccourcis Ctrl+F et entrez son identifiant dans le champ de recherche rendu visible.
    </div>
    <div class="text-center m-4">
        <asp:Button runat="server" CssClass="button selector selected" ID="new" OnClick="new_Click" Text="Nouvelle" /><!--
        --><asp:Button runat="server" CssClass="button selector" ID="current" OnClick="current_Click" Text="En cours" /><!--
        --><asp:Button runat="server" CssClass="button selector" ID="closed" OnClick="closed_Click" Text="Fermé" />
    </div>
        <div class="round w-75 mx-auto">
            <table class="table">
                <thead class="thead-light">
                    <tr>
                        <th scope="col">ID</th><th scope="col">Statut</th><th scope="col">Date</th><th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody id="history" runat="server">

                </tbody>
            </table>
        </div>


</asp:Content>
