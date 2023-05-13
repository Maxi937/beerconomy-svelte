<script>
  import ProfilePicture from "../components/ProfilePicture.svelte";
  import EditUserForm from "../components/EditUserForm.svelte";
  import Review from "../components/Review.svelte";
  import { createEventDispatcher, getContext, onMount } from "svelte";

  const beerconomyService = getContext("BeerconomyService");

  let reviews = [];

  const reviewOptions = {
    candelete: true,
    username: false,
    profilepicture: false,
  };

  onMount(async () => {
    reviews = await beerconomyService.getProfileReviews();
  });

  async function updateReviews() {
    reviews = [];
    reviews = await beerconomyService.getProfileReviews();
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

<div class="section">
  {#each reviews as review}
    <Review {review} {reviewOptions} on:reviewDeleted={updateReviews} />
  {/each}
</div>
