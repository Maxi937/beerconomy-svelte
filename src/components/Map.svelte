<script>
  import { user } from "../stores";
  import { fade, blur } from "svelte/transition";
  import { LeafletMap } from "../services/leaflet-map";
  import { getContext, onMount } from "svelte";
  import AddPlaceForm from "./AddPlaceForm.svelte";
  import { createEventDispatcher } from "svelte";
  import LoginSignupControl from "./LoginSignupControl.svelte";
  import Loader from "./Loader.svelte";
  import { preSelectedPlace } from "../stores";

  const beerconomyService = getContext("BeerconomyService");

  const mapConfig = {
    location: { lat: 53.44, lng: -7.5 },
    zoom: 7,
    minZoom: 7,
    maxZoom: 12,
  };

  let map;
  let place;
  let markersAddedToMap = false;
  let showAddPlace = false;
  let addPlaceLat;
  let addPlaceLng;
  const dispatch = createEventDispatcher();

  onMount(async () => {
    map = new LeafletMap("map", mapConfig);
    map.showZoomControl();

    let places = await beerconomyService.getAllPlaces();
    places.forEach((place) => {
      addPlaceMarker(place);
    });

    map.imap.addEventListener("click", handleMapClick);
    map.showLayerControl();
    markersAddedToMap = true;
    document.getElementById("map").style.visibility = "visible";
    document.getElementById("map").style.opacity = "100";

    if ($preSelectedPlace.place) {
      console.log("hello");
      place = $preSelectedPlace.place;
      map.setSelectedMarker(place.lat, place.lng);
      dispatch("placeselected", { place });
      preSelectedPlace.set({ place: {} });
    }
  });

  export function addPlaceMarker(place) {
    const marker = map.addMarker({ lat: place.lat, lng: place.lng }, place.placeName, place.category);
    marker.addEventListener("click", handlePlaceMarkerClick);
  }

  async function handlePlaceMarkerClick() {
    let lat = this._latlng.lat;
    let lng = this._latlng.lng;
    place = await beerconomyService.getPlaceLatLng(lat, lng);
    dispatch("placeselected", { place });
  }

  function handleMapClick() {
    window.addEventListener("clickmarkerbuttonclick", addPlace);
  }

  export function addPlace() {
    showAddPlace = true;
    addPlaceLat = map.clickmarker._latlng.lat;
    addPlaceLng = map.clickmarker._latlng.lng;
    document.getElementById("map").style.zIndex = "0";
  }

  function closeAddPlace() {
    showAddPlace = false;
    document.getElementById("map").style.display = "block";
  }

  async function reloadPlaces() {
    let places = await beerconomyService.getAllPlaces();
    places.forEach((place) => {
      addPlaceMarker(place);
    });
    if ((showAddPlace = true)) {
      showAddPlace = false;
    }
  }

  function handleLoginSignup() {
    reloadPlaces();
  }

  function handleMapVisible() {
    console.log("making map visible");
    document.getElementById("map").classList.add("showMap");
  }
</script>

{#if !markersAddedToMap}
  <div in:blur class="box is-flex is-align-items-center is-justify-content-center" id="mapPlaceholder">
    <Loader />
  </div>
{/if}

<div class="box" id="map" />

{#if showAddPlace}
  <div class="modal is-active" id="modal" transition:fade>
    <div class="modal-background" />
    <div class="modal-content" id="modal-content">
      <div class="box">
        <div class="is-flex is-justify-content-end" id="delete">
          <button class="button is-ghost" on:click={closeAddPlace}>
            <span class="icon">
              <ion-icon name="close-sharp" />
            </span>
          </button>
        </div>
        {#if $user.token}
          <AddPlaceForm lat={addPlaceLat} lng={addPlaceLng} on:placeAdded={reloadPlaces} />
        {:else}
          <div class="box">
            <LoginSignupControl on:loginSignupControlFinished={handleLoginSignup} />
          </div>
        {/if}
      </div>
    </div>
    <button class="modal-close is-large" aria-label="close" />
  </div>
{:else}
  <div />
{/if}

<style>
  #map {
    height: 480px;
    visibility: hidden;
    opacity: 0;
    transition: opacity ease 0.5s;
  }

  #mapPlaceholder {
    height: 480px;
  }

  .modal {
    top: -150px;
  }
</style>
