<script>
  import Map from "../components/Map.svelte";
  import { createEventDispatcher, getContext, onMount } from "svelte";
  import Review from "../components/Review.svelte";
  import Place from "../components/Place.svelte";

  const beerconomyService = getContext("BeerconomyService");

  let reviews = [];
  let place;
  let rating;
  let stats = {
    reviews: 0,
    places: 0,
  };

  onMount(async () => {
    reviews = await beerconomyService.getAllReviews();
    let places = await beerconomyService.getAllPlaces();
    stats.places = places.length;
    stats.reviews = reviews.length;
  });

  async function handlePlaceSelected(event) {
    place = event.detail.place;
    reviews = await beerconomyService.getPlaceReviews(place._id);
    rating = getAvgFromReviews(reviews);
  }

  async function handleReviewAdded() {
    reviews = await beerconomyService.getPlaceReviews(place._id);
    rating = getAvgFromReviews(reviews);
  }

  function getAvgFromReviews(reviews) {
    console.log(reviews);
    let sum = 0;

    for (let i = 0; i < reviews.length; i++) {
      sum = reviews[i].rating + sum;
    }
    return sum / reviews.length;
  }
</script>

<div>
  <Map on:placeselected={handlePlaceSelected} />
</div>

{#if place}
  <div class="box">
    <Place {place} {rating} on:reviewAdded={handleReviewAdded} />
  </div>
{:else}
  <div class="box">
    <div class="columns">
      <div class="column">
        <div class="box has-background-primary has-text-white">
          <div class="has-text-centered is-size-4">Places</div>
          <div class="has-text-centered is-size-3">
            {stats.places}
          </div>
        </div>
      </div>
      <div class="column">
        <div class="box has-background-primary has-text-white">
          <div class="has-text-centered is-size-4">Reviews</div>
          <div class="has-text-centered is-size-3">
            {stats.reviews}
          </div>
        </div>
      </div>
    </div>
    <div class="box">
      <p id="herofont">Check out the latest from our users</p>
    </div>
  </div>
{/if}

{#if reviews[0]}
  <div>
    {#each reviews as review}
      <Review {review} />
    {/each}
  </div>
{/if}

<style>
  #herofont {
    font-family: Helvetica, Arial, "Lucida Grande", sans-serif;
    font-weight: 500;
  }
</style>
