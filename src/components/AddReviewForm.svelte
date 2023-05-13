<script>
  import { user } from "../stores";
  import { createEventDispatcher, getContext, onMount } from "svelte";
  import { fade, blur } from "svelte/transition";

  export let place;
  const beerconomyService = getContext("BeerconomyService");
  const dispatch = createEventDispatcher();

  let message;

  let review = {
    date: new Date(),
    user: $user.token,
    rating: "",
    content: "",
    place,
  };

  async function addReview() {
    console.log(review);
    for (let [key, value] of Object.entries(review)) {
      if (value === "") {
        message = "Please fill in all fields";
        return [];
      }
    }
    console.log(review);

    const success = await beerconomyService.addReview(review);

    if (!success) {
      message = "Something went wrong";
    } else {
      dispatch("reviewAdded");
    }
  }
</script>

<div class="box has-background-info-light">
  <form on:submit|preventDefault={addReview}>
    <h2>Tell us what you think</h2>
    <br />

    <div class="control">
      <label class="radio">
        <input bind:group={review.rating} type="radio" value="1" name="rating" />
        Bad
      </label>
      <label class="radio">
        <input bind:group={review.rating} type="radio" value="2" name="rating" />
        Okay
      </label>
      <label class="radio">
        <input bind:group={review.rating} type="radio" value="3" name="rating" />
        Grand
      </label>
      <label class="radio">
        <input bind:group={review.rating} type="radio" value="4" name="rating" />
        Unreal
      </label>
      <label class="radio">
        <input bind:group={review.rating} type="radio" value="5" name="rating" />
        Best Night of my life
      </label>
    </div>

    <br />

    <div class="field">
      <div class="control">
        <textarea bind:value={review.content} class="textarea" name="content" placeholder="Write your Review" />
      </div>
    </div>

    <div class="field">
      <div class="control">
        <label class="checkbox">
          <input type="checkbox" />
          I agree to the <a href="#">terms and conditions</a>
        </label>
      </div>
    </div>

    <div class="field">
      <div class="control">
        <button class="button is-link">Submit</button>
      </div>
    </div>
  </form>

  {#if message}
    <div class="box mt-5 has-background-danger has-text-white" transition:fade>
      {message}
    </div>
  {/if}
</div>
