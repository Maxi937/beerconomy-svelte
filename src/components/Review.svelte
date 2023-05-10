<script>
  import {createEventDispatcher, getContext, onMount} from "svelte";

  const beerconomyService = getContext("BeerconomyService");

  export let review = {};
  export let reviewOptions = {
    candelete: false,
    username: true,
    profilepicture: true,
  };
  let userProfile = {};

  const dispatch = createEventDispatcher();

  onMount(async () => {
    userProfile = await beerconomyService.getUserProfile(review.user); // THis value should be hashed in the review model
  });

  const stars = function (rating) {
    if (rating > 5) {
      rating = 5;
    }
    let icons = "";
    for (let i = 0; i < rating; i++) {
      icons += `<span class="icon"><i class="fas fa-star"></i></span>`;
    }
    return icons;
  };

  async function deleteReview() {
    const success = beerconomyService.deleteReview(review._id);
    if (!success) {
      alert("Something went wrong");
    } else {
      console.log("deleting review");
      dispatch("reviewDeleted");
    }
  }
</script>

<div class="card">
  {#if reviewOptions.candelete}
    <div class="is-flex is-justify-content-end" id="delete">
      <button class="button is-ghost" on:click={deleteReview}>
        <span class="icon">
          <ion-icon name="close-sharp"></ion-icon>
        </span>
      </button>
    </div>
  {/if}
  <div class="card-content">
    <div class="media">
      {#if reviewOptions.profilepicture}
        <div class="media-left">
          {#if userProfile.profilepicture}
            <figure class="image is-64x64">
              <img
                class="is-rounded"
                style="width: 64px; height: 64px"
                id="reviewProfilePicture"
                src="data:{userProfile.profilepicture.contentType};base64,{userProfile.profilepicture.data}"
                alt="Profile"
              />
            </figure>
          {/if}
        </div>
      {/if}
      <div class="media-content">
        <div class="column is-narrow">
          <p class="title is-4" id="userName">{userProfile.userName}</p>
          <p class="subtitle is-7 is-italic" id="reviewRating">{review.date}</p>
        </div>
      </div>
      <div class="content" id="reviewDate">{@html stars(review.rating)}</div>
    </div>
    <div class="content" id="reviewContent">{review.content}</div>
    <div class="is-flex is-justify-content-end" id="socials">
      <span class="tag">{review.place.placeName}</span>
    </div>
  </div>
</div>

<style>

.card {
  margin-top: 10px;
  margin-bottom: 10px;
  border-radius: 50px;
}



</style>