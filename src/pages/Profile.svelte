<script>
  import ProfilePicture from "../components/ProfilePicture.svelte";
  import EditUserForm from "../components/EditUserForm.svelte";
  import Review from "../components/Review.svelte";
  import Loader from "../components/Loader.svelte";
  import { createEventDispatcher, getContext, onMount } from "svelte";
  import { fade } from "svelte/transition";
  import Favourite from "../components/Favourite.svelte";

  const beerconomyService = getContext("BeerconomyService");

  let profile;

  const reviewOptions = {
    candelete: true,
    username: false,
    profilepicture: false,
  };

  onMount(async () => {
    profile = await beerconomyService.getProfile();
    console.log(profile);
  });

  async function updateReviews() {
    profile = await beerconomyService.getProfile();
  }
</script>

<div class="columns">
  <div class="column">
    <ProfilePicture />
  </div>
  <div class="column">
    <EditUserForm />
  </div>
</div>

{#if profile}
  {#if profile.favourites}
  <div class = "block">
    <p class="Header is-narrow">
      Favourites
    </p>
    <div class="box is-flex">
    {#each profile.favourites as favourite}
    <Favourite {favourite} />
    {/each}
    </div>
  </div>
  {/if}
  <p class="Header is-narrow">
    All Reviews
  </p>
  {#if profile.reviews}
    <div transition:fade>
      {#each profile.reviews as review}
        <Review {review} {reviewOptions} on:reviewDeleted={updateReviews} />
      {/each}
    </div>
  {/if}
{:else}
  <Loader />
{/if}

<style>
  .Header {
    width:10%;
    background-color: aquamarine;
    border-radius: 10px;
    padding: 5px;
    text-align: center;
    margin-bottom: 6px;
    font-family: Helvetica, Arial, "Lucida Grande", sans-serif;
    font-weight: 500;
  }
</style>
