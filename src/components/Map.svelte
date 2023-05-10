<script>
    import {LeafletMap} from '../services/leaflet-map';
    import {getContext, onMount} from "svelte";

    const beerconomyService = getContext("BeerconomyService");

    const mapConfig = {
    location: {lat: 53.44, lng: -7.5},
    zoom: 7,
    minZoom: 7,
    maxZoom: 12
  };
  let map = null;

  onMount(async () => {
    map = new LeafletMap("map", mapConfig);
    //map.showZoomControl();
    //map.addLayerGroup('Donations');
    //map.showLayerControl();

    const places = await beerconomyService.getPlaces();
  });

</script>


<div class="box" id="map" style="height: 480px;"></div>
