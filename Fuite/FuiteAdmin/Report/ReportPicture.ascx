<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="ReportPicture.ascx.cs" Inherits="FuiteAdmin.Report.ReportPicture" %>
<div class="col-md-4 report-picture">
    <div class="thumbnail mb-2">
        <a href="<%= this.Picture.data %>" >
            <img src="<%= this.Picture.data %>" class="img-thumbnail" style="width:100%;"/>
        </a>
        <span class="date">Le <%= this.Picture.date.ToString("dd/MM/yy hh:mm") %></span>
        <span class="ban round">
              <asp:CheckBox runat="server" ID="ban_check" Text="Supprimer tout le contenu de cet utilisateur depuis 24 heures" />
            <asp:Button runat="server" ID="ban" CssClass="button" Text="Supprimer le contenu" CausesValidation="False" OnClientClick="return confirm('Etes-vous sûr de vouloir supprimer ce contenu ?')" OnClick="ban_Click" />
        </span>
    </div>

</div>
