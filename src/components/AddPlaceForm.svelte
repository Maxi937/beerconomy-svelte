<script>
  import { createEventDispatcher, getContext, onMount } from "svelte";
  import { fade, blur } from "svelte/transition";

  const beerconomyService = getContext("BeerconomyService");

  let message = "";

  export let lat;
  export let lng;

  const dispatch = createEventDispatcher();

  let place = {
    placeName: "",
    category: "",
    address: "",
    picture: [],
    lat: lat,
    lng: lng,
  };

  async function addPlace() {
    for (let [key, value] of Object.entries(place)) {
      if (value === "") {
        message = "Please fill in all fields";
        return [];
      }
    }
    console.log(place);

    const success = beerconomyService.addPlace(place);

    if (!success) {
      message = "Something went wrong";
    } else if (success && place.picture) {
      let newplace = await beerconomyService.getPlaceLatLng(place.lat, place.lng);
      console.log(newplace._id);
      await beerconomyService.addPlacePhoto(newplace._id, place.picture[0]);
      dispatch("placeAdded")
    }
  }
</script>

<form on:submit|preventDefault={addPlace} enctype="multipart/form-data">
  <div class="columns">
    <div class="column">
      <div class="field">
        <p class="control has-icons-left">
          <input bind:value={place.placeName} class="input" placeholder="Place Name" name="placeName" id="placeName" />
          <span class="icon is-small is-left">
            <i class="fas fa-home" />
          </span>
        </p>
      </div>
    </div>
    <div class="column">
      <select bind:value={place.category} class="select" id="category">
        <option>Pub</option>
        <option>Restaurant</option>
        <option>Nightclub</option>
      </select>
    </div>
  </div>

  <div class="field">
    <p class="control has-icons-left">
      <input bind:value={place.address} class="input" placeholder="Address" name="address" id="address" />
      <span class="icon is-small is-left">
        <i class="fas fa-map-marker" />
      </span>
    </p>
  </div>

  <div id="placepicture" class="file has-name">
    <label class="file-label">
      <input bind:files={place.picture} class="file-input" type="file" name="placepicture" accept="image/jpeg,image/gif,image/png,application/pdf,image/x-eps" />
      <span class="file-cta">
        <span class="file-icon">
          <i class="fas fa-upload" />
        </span>
        <span class="file-label"> Upload a photo </span>
      </span>
      {#if place.picture && place.picture[0]}
        <span class="file-name"> {place.picture[0].name} </span>
      {/if}
    </label>
  </div>
  <br />

  <div class="field has-text-centered">
    <p class="control">
      <button class="button is-success"> Submit </button>
    </p>
  </div>
</form>

{#if message}
  <div class="box mt-5 has-background-danger has-text-white" transition:fade>
    {message}
  </div>
{/if}

<style>
  #category {
    border-radius: 20px;
    width: 100%;
  }
  #category:hover {
    background-color: rgba(0, 0, 0, 0);
    transition: all 0.2s ease-in-out;
    border-color: hsl(154, 100%, 50%);
  }
  #category option:checked {
    font: bolder;
  }
</style>
