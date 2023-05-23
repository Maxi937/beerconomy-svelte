<script>
  import ProfilePicture from "../components/ProfilePicture.svelte";
  import EditUserForm from "../components/EditUserForm.svelte";
  import Review from "../components/Review.svelte";
  import { createEventDispatcher, getContext, onMount } from "svelte";

  const beerconomyService = getContext("BeerconomyService");

  let profile;

  const reviewOptions = {
    candelete: true,
    username: false,
    profilepicture: false,
  };

  onMount(async () => {
    profile = await beerconomyService.getProfile();
    console.log(profile.reviews);
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

{#await profile}
  <div>Awaiting</div>
{:then profile}
  <div class="columns">
    {#if profile && profile.reviews}
      <div class="column">
        {#each profile.reviews as review}
          <Review {review} {reviewOptions} on:reviewDeleted={updateReviews} />
        {/each}
      </div>
    {/if}
  </div>
{:catch error}
  {error.message}
{/await}
