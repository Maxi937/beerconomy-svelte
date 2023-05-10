<script>
  import { marker } from "leaflet";
  import { LeafletMap } from "../services/leaflet-map";
  import { getContext, onMount } from "svelte";

  const beerconomyService = getContext("BeerconomyService");

  const mapConfig = {
    location: { lat: 53.44, lng: -7.5 },
    zoom: 7,
    minZoom: 7,
    maxZoom: 12,
  };
  let map = null;

  onMount(async () => {
    map = new LeafletMap("map", mapConfig);
    //map.showZoomControl();
    map.addLayerGroup('Places');
    //map.showLayerControl();

    const places = await beerconomyService.getPlaces();
    places.forEach(place => {
      addPlaceMarker(place)
    });

    map.hideMarkersInLayer("Places")

    const markers = map.getAllMarkers()
    markers.forEach(marker => {
      marker.on("click", (e) => {
        map.deleteClickMarker()
        console.log(marker._latlng)
      })
      
    });

  });

  export function addPlaceMarker(place) {
    map.addMarker({lat: place.lat, lng: place.lng}, place.placeName, "Places");
  }

  function turnOn() {
    map.showMarkersInLayer("Places")
  }

</script>

<div class="box" id="map" style="height: 480px;" />
<div class="box">
  <button on:click={turnOn} class="button">Show Places</button>
</div>
