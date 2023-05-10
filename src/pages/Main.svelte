<script>
    import Map from "../components/Map.svelte";
    import { user } from "../stores";
    import {createEventDispatcher, getContext, onMount} from "svelte";
    import Review from "../components/Review.svelte";


    const beerconomyService = getContext("BeerconomyService");

    let reviews = []

    onMount(async () => {
    reviews = await beerconomyService.getAllReviews()
  });

  </script>

  <div>
    <Map/>
  </div>

  <div>
    {#each reviews as review}
      <Review review = {review}/>
    {/each}
  </div>
