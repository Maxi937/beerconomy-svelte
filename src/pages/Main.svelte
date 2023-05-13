<script>
  import Map from "../components/Map.svelte";
  import { createEventDispatcher, getContext, onMount } from "svelte";
  import Review from "../components/Review.svelte";
  import Place from "../components/Place.svelte";

  const beerconomyService = getContext("BeerconomyService");

  let reviews = [];
  let place
  let rating

  onMount(async () => {
    reviews = await beerconomyService.getAllReviews();
  });

  async function handlePlaceSelected(event){
    place = event.detail.place
    reviews = await beerconomyService.getPlaceReviews(place._id)
    rating = getAvgFromReviews(reviews)
  }

  async function handleReviewAdded() {
    reviews = await beerconomyService.getPlaceReviews(place._id)
  }

  function getAvgFromReviews(reviews) {
    console.log(reviews)
    let sum = 0

    for (let i = 0; i < reviews.length; i++) {
      sum = reviews[i].rating + sum
    }
    return sum / reviews.length
  }
</script>

<div>
  <Map on:placeselected={handlePlaceSelected}/>
</div>

{#if place}
  <div class="box">
    <Place place={place} rating={rating} on:reviewAdded={handleReviewAdded}/>
  </div>
{/if}

{#if reviews[0]}
<div>
  {#each reviews as review}
    <Review {review} />
  {/each}
</div>
{/if}
