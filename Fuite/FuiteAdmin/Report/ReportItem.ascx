<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="ReportItem.ascx.cs" Inherits="FuiteAdmin.Report.ReportItem" %>
<div class="report-item">
    <a runat="server" id="link" href="../Details.aspx">
        <span class="id"><asp:Label runat="server" ID="reportId"></asp:Label></span><span class="ip"><asp:Label runat="server" ID="reportIp"></asp:Label></span>
    </a>
</div>
