<script>
  import Map from "../components/Map.svelte";
  import { getContext, onMount } from "svelte";
  import Review from "../components/Review.svelte";
  import Place from "../components/Place.svelte";
  import { fade, blur } from "svelte/transition";


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
    place = ""
    place = await event.detail.place;
  }

  async function handleReviewAdded() {
    reviews = await beerconomyService.getPlaceReviews(place._id);
  }
</script>

<div in:blur|local>
  <Map on:placeselected={handlePlaceSelected} />
</div>

{#if place}
  <div class="box">
    <Place place={place} on:reviewAdded={handleReviewAdded} />
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

{#if !place}
  {#if reviews[0]}
    <div>
      {#each reviews as review}
        <Review {review} />
      {/each}
    </div>
  {/if}
{/if}

<style>
  #herofont {
    font-family: Helvetica, Arial, "Lucida Grande", sans-serif;
    font-weight: 500;
  }
</style>
