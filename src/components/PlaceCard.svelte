<script>
  import { createEventDispatcher, getContext, onMount } from "svelte";
  import { user } from "../stores";
  import Review from "./Review.svelte";
  import { fade, blur } from "svelte/transition";
  import AddReviewForm from "./AddReviewForm.svelte";
  import Weather from "./Weather.svelte";
  import Loader from "./Loader.svelte";

  export let place;
  let reviews;
  let rating = 0;
  let showReviewForm;
  let numberOfReviews = 0;
  let weather = {};

  const beerconomyService = getContext("BeerconomyService");

  onMount(async () => {
    reviews = await beerconomyService.getPlaceReviews(place._id);
    weather = await beerconomyService.getWeather(place.lat, place.lng);
    if (reviews) {
      rating = getAvgFromReviews(reviews);
      numberOfReviews = reviews.length;
    }
  });

  function openReviewForm() {
    showReviewForm = true;
    document.getElementById("map").style.zIndex = "0";
  }

  function closeReviewForm() {
    showReviewForm = false;
    document.getElementById("map").style.display = "block";
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
    <p class="title is-3" id="placeName">{place.placeName}</p>
    {#if reviews}
    <p class="subtitle is-5" id="placeRating" transition:blur>{@html stars(rating)}</p>
    <p class="subtitle is-7 is-italic" id="reviews" transition:blur>{numberOfReviews} reviews</p>
    {:else}
    <p class="subtitle is-5" id="placeRating">{@html stars(1)}</p>
    <p class="subtitle is-7 is-italic" id="reviews">0 reviews</p>
    {/if}
  </div>
  {#if place.description}
    <div class="content">
      {place.description}
    </div>
  {/if}
  <div class="is-flex is-justify-content-end">
    <p class="tag" id="placeAddress">{place.address}</p>
  </div>
</div>

<style>
  #placeRating {
    margin-top: -15px;
  }

  #placeName {
    margin-top: -15px;
  }

  #placeAddress {
    margin-top: -40px;
    margin-right: 20px;
    margin-bottom: 0;
  }

  #reviews {
    margin-top: -20px;
  }

  * {
    font-family: Helvetica, Arial, "Lucida Grande", sans-serif;
    font-weight: 500;
  }
</style>
