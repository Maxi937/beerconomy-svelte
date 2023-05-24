<script>
  import { blur } from "svelte/transition";
  import PlaceCard from "./PlaceCard.svelte";
  import { push } from "svelte-spa-router";
  import { preSelectedPlace } from "../stores";

  export let favourite;

  let popup = false;

  function showFavouritePopup() {
    popup = true;
  }

  function closeFavouritePopup() {
    popup = false;
  }

  function handleFavouriteClick() {
    const place = favourite;
    preSelectedPlace.set({ place });
    push("/");
  }
</script>

<button on:click={handleFavouriteClick} on:mouseenter={showFavouritePopup} on:mouseleave={closeFavouritePopup}>
  <figure class="image is-flex is-justify-content-center">
    <img class="is-rounded" src="data:{favourite.picture.contentType};base64,{favourite.picture.data}" alt="Placeholder" style="width:80px; height:80px;" />
  </figure>
</button>

{#if popup}
  <div class="popup is-flex" transition:blur>
    <div class="popuptext" id="myPopup" on:mouseenter={showFavouritePopup} on:mouseleave={closeFavouritePopup}>
      <PlaceCard place={favourite} on:favouriteDeleted />
    </div>
  </div>
{/if}

<style>
  button {
    margin: 10px;
    padding: 5px;
    border-style: solid !important;
    border-radius: 50%;
    border-color: transparent;
    border-width: 1px;
    filter: brightness(70%);
    cursor: pointer;
  }

  button:hover {
    transition: all 0.3s ease;
    box-shadow: 0px 0px 0px 4px inset #79fa6e;
    filter: brightness(100%);
  }

  .popup {
    position: relative;
    display: inline-block;
    z-index: 1;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  /* The actual popup */
  .popup .popuptext {
    width: 500px;
    color: #fff;
    position: absolute;
    z-index: 1;
    top: 100%;
    left: 50%;
    margin-left: -80px;
  }
</style>
