<script>
  import { createEventDispatcher, getContext, onMount } from "svelte";
  import { user } from "../stores";
  import Review from "../components/Review.svelte";
  import { fade, blur } from "svelte/transition";
  import AddReviewForm from "./AddReviewForm.svelte";
  import Router, { push } from "svelte-spa-router";
  import Weather from "./Weather.svelte";
  import Loader from "./Loader.svelte";
  import MiniLoader from "./MiniLoader.svelte";
 

  export let place;
  console.log(place)
  let reviews;
  let rating = 0;
  let showReviewForm;
  let numberOfReviews = 0;
  let weather;
  let showWeather = false;
  const dispatch = createEventDispatcher();
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

  function showWeatherPopup() {
    showWeather = true;
  }

  function closeWeatherPopup() {
    showWeather = false;
  }

  async function handleReviewAdded() {
    reviews = await beerconomyService.getPlaceReviews(place._id);
    closeReviewForm();
    dispatch("reviewAdded");
  }

  function pushSignUp() {
    push("/signup");
  }

  async function addFavourite() {
    console.log(place)
    await beerconomyService.addFavourite(place)
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

{#if showReviewForm}
  <div class="modal is-active" id="modal" transition:fade>
    <div class="modal-background" />
    <div class="modal-content">
      <div class="box">
        <div class="is-flex is-justify-content-end" id="delete">
          <button class="button is-ghost" on:click={closeReviewForm}>
            <span class="icon">
              <ion-icon name="close-sharp" />
            </span>
          </button>
        </div>
        <AddReviewForm {place} on:reviewAdded={handleReviewAdded} />
      </div>
    </div>
    <button class="modal-close is-large" aria-label="close" />
  </div>
{/if}

<div class="card">
  <div class="card-content">
    <div class="media">
      <div class="media-left">
        <figure class="image is-128x128 is-flex is-align-items-center">
          <img class="is-rounded" src="data:{place.picture.contentType};base64,{place.picture.data}" alt="Placeholder" />
        </figure>
      </div>
      <div class="media-content">
          <div class="columns" id="content-top">
            <div class="column is-narrow" >
              {#if weather}
              <button in:blur|local on:mouseenter={showWeatherPopup} on:mouseleave={closeWeatherPopup} class="is-rounded" id="weatherButton">
                <figure class="image is-32x32">
                  <img class="is-rounded" src={weather.icon} alt="Placeholder" />
                </figure>
              </button>
              {:else}
              <button id="weatherButton" class=block in:blur|local>
                <figure class="image is-32x32">
                  <MiniLoader/>
                </figure>
              </button>
              {/if}
            </div>
            {#if showWeather}
              <div class="column" id="weatherpopup" transition:blur>
                <Weather {weather} />
              </div>
            {/if}
          </div>
        <p class="title is-3" id="placeName">{place.placeName}</p>
        {#if reviews}
        <p in:blur|local class="subtitle is-5" id="placeRating">{@html stars(rating)}</p>
        <p in:blur|local class="subtitle is-7 is-italic" id="reviews">{numberOfReviews} reviews</p>
        {:else}
        <p in:blur|local class="subtitle is-5" id="placeRating"><MiniLoader/></p>
        <p in:blur|local class="subtitle is-7 is-italic" id="reviews">0 reviews</p>
        {/if}
      </div>
      {#if $user.token}
        <div class="columns is-gapless">
          <div class="column is-4">
            <button class="button is-primary" on:click={addFavourite}>
              <span class="icon is-large">
                <i class="fas fa-star" />
              </span>
            </button>
          </div>
          <div class="column">
            <button class="button is-info" on:click={openReviewForm}>
              <span class="icon is-large">
                <i class="fas fa-book-open" />
              </span>
              <span>Review</span>
            </button>
          </div>
        </div>
      {:else}
        <button class="button is-info is-pulled-right" on:click={pushSignUp}>
          <span class="icon is-large">
            <i class="fas fa-book-open" />
          </span>
          <span>Sign Up to leave a review</span>
        </button>
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
</div>

{#if reviews}
  <div>
    {#each reviews as review}
      <Review {review} />
    {/each}
  </div>
{/if}

<style>
  #content-top {
    margin-bottom: -10px;
  }

  #placeRating {
    margin-top: -15px;
  }

  #placeName {
    margin-top: -15px;
  }

  #placeAddress {
    margin-top: -40px;
    margin-bottom: 0;
  }

  #reviews {
    margin-top: -20px;
  }

  #weatherButton:hover {
    background: rgb(95, 108, 250);
    transition: all 0.7s ease-in-out;
  }

  #weatherButton:active {
    border-color: black;
    outline: none !important;
  }

  #weatherButton:focus {
    border: none !important;
    outline: none !important;
  }

  #weatherButton {
    color: rgb(6, 6, 6);
    outline: none !important;
    border: none !important;
    background: rgb(255, 255, 255);
    border-radius: 100px;

    cursor: pointer !important;
  }

  * {
    font-family: Helvetica, Arial, "Lucida Grande", sans-serif;
    font-weight: 500;
  }
</style>
