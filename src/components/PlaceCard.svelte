<script>
  import { createEventDispatcher, getContext, onMount } from "svelte";
  import { fade, blur } from "svelte/transition";
  import MiniLoader from "./MiniLoader.svelte";

  
  export let place;
  let reviews;
  let rating = 0;
  let showReviewForm;
  let numberOfReviews = 0;
  let weather = {};

  const beerconomyService = getContext("BeerconomyService");
  const dispatch = createEventDispatcher();

  onMount(async () => {
    reviews = await beerconomyService.getPlaceReviews(place._id);
    weather = await beerconomyService.getWeather(place.lat, place.lng);
    if (reviews) {
      rating = getAvgFromReviews(reviews);
      numberOfReviews = reviews.length;
    }
  });

  async function deleteFavourite() {
    await beerconomyService.deleteFavourite(place._id)
    dispatch("favouriteDeleted")
  }

  function getAvgFromReviews(reviews) {
    let sum = 0;
    for (let i = 0; i < reviews.length; i++) {
      sum = reviews[i].rating + sum;
    }
    return sum / reviews.length;
  }

  function stars(rating) {
    if (rating > 5) {
      rating = 5;
    }
    let icons = "";
    for (let i = 0; i < rating; i++) {
      icons += `<span class="icon"><i class="fas fa-star"></i></span>`;
    }
    return icons;
  }
</script>

<div class="card">
  <div class="card-content">
    <div class="columns">
      <div class="column">
        <p class="title is-3" id="placeName">{place.placeName}</p>
      </div>
      <div class="column is-flex is-justify-content-end">
        <button class="button is-small is-warning" on:click={deleteFavourite}> Unfavourite </button>
      </div>
    </div>

    <div class="block" id="placeRating">
      {#if reviews}
        <p in:blur>{@html stars(rating)}</p>
      {:else}
        <MiniLoader />
      {/if}
    </div>

    <div class="columns is-flex is-align-items-center" id="reviews">
      <div class="column">
        <p class="subtitle is-7 is-italic" in:blur>
          {#if reviews}
            {numberOfReviews} reviews
          {:else}
            0 reviews
          {/if}
        </p>
      </div>
      <div class="column is-flex is-justify-content-end">
        <p class="tag">{place.address}</p>
      </div>
    </div>
  </div>
</div>

<style>
  #placeRating {
    height: 30px;
    margin-top: -15px;
  }

  #reviews {
    margin-top: -40px;
  }

  * {
    font-family: Helvetica, Arial, "Lucida Grande", sans-serif;
    font-weight: 500;
  }

  .button {
    transition: all 0.4s ease-in-out;
  }

  .button:hover {
    background-color: aquamarine;
    color: black;
    transition: all ease 0.4s;
  }
</style>
