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
  }

  markerBehaviour(e) {
    this.closeAllPopups();
    e.target.openPopup();
    this.deleteClickMarker();
  }

  clickmarkerBehaviour(e) {
    this.closeAllPopups();
    this.clickmarker.remove();
    this.clickmarker = L.marker(e.latlng);
    this.clickmarker.addTo(this.imap);
    this.clickmarker.bindPopup(`
          <button class="button is-small is-primary has-text-centered" id="addPlace-${this.clickmarker._leaflet_id}">
            Add a place
          </button>`);
    this.clickmarker.openPopup();
    this.moveTo(this.imap.zoom, e.latlng);
  }

  addLayer(title, layer) {
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
      group = L.layerGroup([]);
      this.overlays[layerTitle] = group;
      this.imap.addLayer(group);
    } else {
      group = this.overlays[layerTitle];
    }
    marker.addTo(group);
    marker.on("click", (e) => {
      this.markerBehaviour(e);
    });
    return marker;
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
