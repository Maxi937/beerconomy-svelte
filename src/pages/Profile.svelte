<script>
  import ProfilePicture from "../components/ProfilePicture.svelte";
  import EditUserForm from "../components/EditUserForm.svelte";
  import Review from "../components/Review.svelte";
  import Loader from "../components/Loader.svelte";
  import { createEventDispatcher, getContext, onMount } from "svelte";
  import { fade, blur } from "svelte/transition";
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
  });

  async function updateComponent() {
    profile = await beerconomyService.getProfile();
  }
</script>

<div class="columns" in:blur out:blur|local>
  <div class="column is-flex">
    <div class="box" style="width:100%;">
      <ProfilePicture />
    </div>
  </div>
  <div class="column is-flex">
    <div class="box" style="width:100%;">
      <EditUserForm />
    </div>
  </div>
</div>

{#if profile}
  {#if profile.favourites[0]}
    <div class="block" in:blur out:blur|local>
      <p class="Header" out:blur>Favourites</p>
      <div class="columns is-flex">
        {#each profile.favourites as favourite}
          <div class="column is-narrow" transition:blur>
            <Favourite {favourite} on:favouriteDeleted={updateComponent} />
          </div>
        {/each}
      </div>
    </div>
  {/if}

  {#if profile.reviews[0]}
  <div in:blur out:blur>
    <p class="Header is-narrow">All Reviews</p>
      {#each profile.reviews as review}
        <Review {review} {reviewOptions} on:reviewDeleted={updateComponent} />
      {/each}
  </div>
  {/if}
{:else}
  <div class="is-flex is-justify-content-center" in:blur>
    <Loader />
  </div>
{/if}

<style>
  .Header {
    width: 30%;
    background-color: aquamarine;
    border-radius: 10px;
    padding: 5px;
    text-align: center;
    margin-bottom: 6px;
    font-family: Helvetica, Arial, "Lucida Grande", sans-serif;
    font-weight: 500;
  }
</style>
