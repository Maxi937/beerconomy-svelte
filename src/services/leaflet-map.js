import * as L from "leaflet";

export class LeafletMap {
  imap = {};
  control = {};
  overlays = {};

  // https://leaflet-extras.github.io/leaflet-providers/preview/

  baseLayers = {
    Terrain: L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap",
    }),
    Satellite: L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
      attribution: "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
    }),
  };

  goldIcon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  greenIcon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  violetIcon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  blueIcon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  clickmarker = L.marker(null);

  constructor(id, descriptor, activeLayer = "") {
    let defaultLayer = this.baseLayers.Terrain;
    if (activeLayer) {
      defaultLayer = this.baseLayers[activeLayer];
    }
    this.imap = L.map(id, {
      center: [descriptor.location.lat, descriptor.location.lng],
      zoom: descriptor.zoom,
      minZoom: descriptor.minZoom,
      maxZoom: descriptor.maxZoom,
      zoomControl: false,
      layers: [defaultLayer],
    });

    this.imap.on("click", (e) => {
      this.clickmarkerBehaviour(e);
    });

    let selectedMarker
  }

  clickmarkerBehaviour(e) {
    this.clickmarker.remove();
    this.imap.selectedMarker = this.clickmarker
    this.colorAllMarkersBlue()
    this.closeAllPopups()
    this.clickmarker = L.marker(e.latlng);
    this.clickmarker.setIcon(this.goldIcon)
    this.clickmarker.addTo(this.imap);
    this.clickmarker.bindPopup(this.clickMarkerButton());
    this.clickmarker.openPopup();
    this.moveTo(this.imap.zoom, e.latlng);
    this.clickmarker.on("mouseover", (e) => {
      this.clickmarker.openPopup();
    });
  }

  clickMarkerButton() {
    const button = document.createElement("button")
    button.classList.add("button", "is-small", "is-primary", "has-text-centered")
    button.innerHTML = "Add a place"
    button.addEventListener("click", this.handleClickMarkerButtonClick)
    return button
  }

  handleClickMarkerButtonClick() {
    const clickmarkerbuttonclick = new Event('clickmarkerbuttonclick');
    window.dispatchEvent(clickmarkerbuttonclick)
  }

  addLayer(title, layer) {
    console.log("adding layer", title)
    this.overlays[title] = layer;
    this.imap.addLayer(layer);
  }

  addLayerGroup(title) {
    this.overlays[title] = L.layerGroup([]);
    this.imap.addLayer(this.overlays[title]);
  }

  showLayerControl() {
    this.control = L.control.layers(this.baseLayers, this.overlays).addTo(this.imap);
  }

  removeLayerControl(layerTitle) {
    console.log(this.overlays[layerTitle]);
    this.control = L.control.layers(this.overlays).remove();
  }

  showZoomControl(position = "topleft") {
    L.control
      .zoom({
        position: position,
      })
      .addTo(this.imap);
  }

  moveTo(zoom, location) {
    this.imap.setZoom(zoom);
    this.imap.panTo(new L.LatLng(location.lat, location.lng));
  }

  zoomTo(location) {
    this.imap.setView(new L.LatLng(location.lat, location.lng), 8);
  }

  addMarker(location, popupText = "", layerTitle = "default") {
    let group = {};
    let marker = L.marker([location.lat, location.lng]);

    if (popupText) {
      var popup = L.popup({ autoClose: false, closeOnClick: false });
      popup.setContent(popupText);
      marker.bindPopup(popup);
    }
    if (!this.overlays[layerTitle]) {
      console.log("adding marker to", layerTitle)
      group = L.layerGroup([]);
      this.overlays[layerTitle] = group;
      this.imap.addLayer(group);
    } else {
      group = this.overlays[layerTitle];
    }
    console.log("adding marker to", group)
    marker.addTo(group);
    this.markerBehaviour(marker);

    return marker;
  }

  markerBehaviour(marker) {
    marker.on("click", (e) => {
      this.colorAllMarkersBlue()
      this.closeAllPopups()
      marker.openPopup();
      this.deleteClickMarker();
      marker.setIcon(this.greenIcon)
      this.imap.selectedMarker = marker;
    });

    marker.on("mouseover", (e) => {
      if (marker != this.imap.selectedMarker) {
        marker.openPopup();
        marker.setIcon(this.violetIcon);
      }
    });

    marker.on("mouseout", (e) => {
      if (marker != this.imap.selectedMarker) {
      marker.closePopup();
      marker.setIcon(this.blueIcon);
      }
    });
  }

  invalidateSize() {
    this.imap.invalidateSize();
    let hiddenMethodMap = this.imap;
    hiddenMethodMap._onResize();
  }

  getAllMarkers() {
    var markers = [];
    this.imap.eachLayer(function (layer) {
      if (layer instanceof L.Marker) {
        markers.push(layer);
      }
    });
    return markers;
  }

  deleteClickMarker() {
    this.imap.removeLayer(this.clickmarker);
  }

  deleteAllMarkers() {
    this.imap.eachLayer(function (layer) {
      if (layer instanceof L.Marker) {
        layer.remove();
      }
    });
  }

  hideMarkersInLayer(layerTitle) {
    this.overlays[layerTitle].eachLayer(function (layer) {
      if (layer instanceof L.Marker) {
        layer.setOpacity(0);
      }
    });
  }

  showMarkersInLayer(layerTitle) {
    this.overlays[layerTitle].eachLayer(function (layer) {
      if (layer instanceof L.Marker) {
        layer.setOpacity(100);
      }
    });
  }

  colorAllMarkersBlue() {
    let markers = this.getAllMarkers()
    markers.forEach((marker) => {
      if (marker != this.clickmarker) {
        marker.setIcon(this.blueIcon)
      } 
    })
  }

  closeAllPopups() {
    this.imap.eachLayer(function (layer) {
      if (layer instanceof L.Marker) {
        layer.closePopup();
      }
    });
  }

  getMarkerById(id) {
    this.imap.eachLayer(function (layer) {
      if (layer instanceof L.Marker) {
        if (layer._leaflet_id === id) {
          return layer;
        }
      }
    });
  }

  getMarkerByLatLng(latlng) {
    this.imap.eachLayer(function (layer) {
      if (layer instanceof L.Marker) {
        console.log(layer);
      }
    });
  }

  getClickMarker() {
    return this.clickmarker;
  }
}

