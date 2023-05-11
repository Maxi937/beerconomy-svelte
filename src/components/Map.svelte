<script>
  import { marker } from "leaflet";
  import { fade, blur } from 'svelte/transition';
  import { LeafletMap } from "../services/leaflet-map";
  import { getContext, onMount } from "svelte";
  import AddPlaceForm from "./AddPlaceForm.svelte";
  import { createEventDispatcher } from "svelte";
  import {setContext} from "svelte";

  const beerconomyService = getContext("BeerconomyService");

  const mapConfig = {
    location: { lat: 53.44, lng: -7.5 },
    zoom: 7,
    minZoom: 7,
    maxZoom: 12,
  };

  let map = null;
  let place;
  let showAddPlace = false
  let addPlaceLat
  let addPlaceLng
  const dispatch = createEventDispatcher();

  onMount(async () => {
    map = new LeafletMap("map", mapConfig);
    map.showZoomControl();
    map.addLayerGroup("Places");
    map.showLayerControl();

    let places = await beerconomyService.getAllPlaces();
    places.forEach((place) => {
      addPlaceMarker(place);
    });

    map.imap.addEventListener("click", handleMapClick);
    //map.hideMarkersInLayer("Places")
  });

  export function addPlaceMarker(place) {
    const marker = map.addMarker({ lat: place.lat, lng: place.lng }, place.placeName, "Places");
    marker.addEventListener("click", handlePlaceMarkerClick);
  }

  async function handlePlaceMarkerClick() {
    let lat = this._latlng.lat;
    let lng = this._latlng.lng;
    place = await beerconomyService.getPlaceLatLng(lat, lng);
    dispatch("placeselected", {place})
  }

  function handleMapClick() {
    let id = map.clickmarker._leaflet_id
    document.getElementById(`addPlace-${id}`).addEventListener("click", addPlace);
  }

  function addPlace() {
    showAddPlace = true
    addPlaceLat = map.clickmarker._latlng.lat
    addPlaceLng = map.clickmarker._latlng.lng
    document.getElementById("map").style.zIndex = "0";
  }

  function closeAddPlace() {
    showAddPlace = false
    document.getElementById("map").style.display = "block";
  }

  async function reloadPlaces() {
    let places = await beerconomyService.getAllPlaces();
    places.forEach((place) => {
      addPlaceMarker(place);
    });
    if (showAddPlace = true) {
      showAddPlace = false
    }
  }
</script>

<div>
  
</div>
<div class="box" id="map" style="height: 480px;" />

{#if showAddPlace}
<div class="modal is-active" id="modal" transition:fade>
  <div class="modal-background"/>
  <div class="modal-content">
    <div class="box">
      <div class="is-flex is-justify-content-end" id="delete">
        <button class="button is-ghost" on:click={closeAddPlace}>
          <span class="icon">
            <ion-icon name="close-sharp" />
          </span>
        </button>
      </div>
    <AddPlaceForm lat = {addPlaceLat} lng = {addPlaceLng} on:placeAdded={reloadPlaces}/>
    </div>
  </div>
  <button class="modal-close is-large" aria-label="close" />
</div>
{/if}


