<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="ReportPicture.ascx.cs" Inherits="FuiteAdmin.Report.ReportPicture" %>

<div class="col-md-4 report-picture">
    <div class="thumbnail mb-2">
        <asp:Label runat="server" AssociatedControlID="check">
                <img src="<%= this.Picture.data %>" class="img-thumbnail" style="width: 100%;" />
        </asp:Label>
        <span class="date text-center">Le <%= this.Picture.date.ToString("dd/MM/yy hh:mm") %></span>
        <span class="ban round">
            <asp:CheckBox runat="server" ID="check" Text="Sélectionner" />
        </span>
    </div>
</div>
