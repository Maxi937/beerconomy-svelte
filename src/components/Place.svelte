<script>
  import { createEventDispatcher, getContext, onMount } from "svelte";
  import { user } from "../stores";
  import Review from "../components/Review.svelte";
  import { fade, blur } from "svelte/transition";
  import AddReviewForm from "./AddReviewForm.svelte";
  import Router, { push } from "svelte-spa-router";

  export let place;
  console.log(place)
  let reviews;
  let rating = 0;
  let showReviewForm;
  let numberOfReviews = 0
  const dispatch = createEventDispatcher();
  const beerconomyService = getContext("BeerconomyService");


  onMount(async () => {
    reviews = await beerconomyService.getPlaceReviews(place._id);
    console.log(reviews)
    if (reviews) {
      rating = getAvgFromReviews(reviews)
      numberOfReviews = reviews.length
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

  async function handleReviewAdded() {
    reviews = await beerconomyService.getPlaceReviews(place._id);
    closeReviewForm();
    dispatch("reviewAdded");
  }

  function pushSignUp() {
    push("/signup");
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
        <figure class="image is-128x128">
          <img class="is-rounded" src="data:{place.picture.contentType};base64,{place.picture.data}" alt="Placeholder" />
        </figure>
      </div>
      <div class="media-content">
        <p class="subtitle is-7" id="reviews">{numberOfReviews} reviews</p>
        <p class="title is-3" id="placeName">{place.placeName}</p>
        <p class="subtitle is-6" id="placeAddress">{place.address}</p>
        <p class="subtitle is-6" id="placeRating">{@html stars(rating)}</p>
      </div>
      {#if $user.token}
        <button class="button is-info is-pulled-right" on:click={openReviewForm}>
          <span class="icon is-large">
            <i class="fas fa-book-open" />
          </span>
          <span>Review</span>
        </button>
        
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
  </div>
</div>

{#if reviews}
  <div>
    {#each reviews as review}
      <Review {review} />
    {/each}
  </div>
{/if}
