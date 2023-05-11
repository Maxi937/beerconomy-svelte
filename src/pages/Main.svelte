<script>
  import Map from "../components/Map.svelte";
  import { setContext } from "svelte";
  import { user } from "../stores";
  import { createEventDispatcher, getContext, onMount } from "svelte";
  import Review from "../components/Review.svelte";

  const beerconomyService = getContext("BeerconomyService");

  let reviews = [];
  let place


  onMount(async () => {
    reviews = await beerconomyService.getAllReviews();
  });

  async function handlePlaceSelected(event){
    console.log(event.detail.place)
  }
</script>

<div>
  <Map on:placeselected={handlePlaceSelected}/>
</div>

{#if place}
  <div class="box">Im a div</div>
{/if}

<div>
  {#each reviews as review}
    <Review {review} />
  {/each}
</div>
