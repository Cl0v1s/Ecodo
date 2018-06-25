<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="ReportItem.ascx.cs" Inherits="FuiteAdmin.Report.ReportItem" %>
<div class="report-item round" >
    <a runat="server" id="link" href="../Details.aspx">
        <span class="id">#<%= this.Report.Id %></span>
        <span class="date mt-2">Le <%= this.Report.Date.ToString("dd/MM/yy hh:mm") %>
        </span><span class="ip">Par <%= this.Report.Ip %></span>
        <span>Signalement(s):<%= this.Report.Quantity %></span>
    </a>
    <span class="show button small mt-4 mb-0" data-id="<%= this.Report.Id %>">Afficher sur la carte</span>
</div>
