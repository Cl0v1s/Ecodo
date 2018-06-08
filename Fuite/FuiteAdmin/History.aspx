<%@ Page Title="" Language="C#" MasterPageFile="~/Index.Master" AutoEventWireup="true" CodeBehind="History.aspx.cs" Inherits="FuiteAdmin.History" %>
<asp:Content ID="Content1" ContentPlaceHolderID="head" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" runat="server">
    <asp:Button runat="server" ID="new" OnClick="new_Click" Text="Nouvelle" />
    <asp:Button runat="server" ID="current" OnClick="current_Click" Text="En cours" />
    <asp:Button runat="server" ID="closed" OnClick="closed_Click" Text="Fermé" />
    <table>
        <thead>
            <tr>
                <td>ID</td><td>Statut</td><td>Date</td><td>Action</td>
            </tr>
        </thead>
        <tbody id="history" runat="server">

        </tbody>
    </table>
    <div>
        Pour rechercher un signalement, entrez le raccourcis Ctrl+F et entrez son identifiant dans le champ de recherche rendu visible.
    </div>
</asp:Content>
