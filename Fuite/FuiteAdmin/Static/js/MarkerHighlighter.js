class MarkerHightlighter {

    constructor() {
        this.markers = {};
        this.highlight = null;
        this.Attach();
    }

    SetMarkers(markers) {
        this.markers = markers;
        console.log(this.markers);
    }

    SetHighlight(id) {
        if (this.highlight != null)
            this.highlight.closePopup();
        this.highlight = null;
        if (this.markers[id] == null)
            return;
        this.markers[id].openPopup();
        this.highlight = this.markers[id];
    }

    Attach() {
        window.addEventListener("load", function () {
            var list = document.querySelectorAll(".report-item .show");
            for (var item in list) {
                item = list[item];
                item.addEventListener("click", function (evt) {
                    event.preventDefault();
                    evt.stopPropagation();
                    var id = evt.target.getAttribute("data-id");
                    MarkerHightlighter.Instance.SetHighlight(id);
                });
            }
        });
    }
}

MarkerHightlighter.Instance = new MarkerHightlighter();
