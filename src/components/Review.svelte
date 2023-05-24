<script>
  import { createEventDispatcher, getContext, onMount } from "svelte";
  import { getLongDate } from "../services/moment";
  import { user } from "../stores";

  const beerconomyService = getContext("BeerconomyService");

  export let review = {};
  export let reviewOptions = {
    candelete: false,
    username: true,
    profilepicture: true,
  };
  let userProfile = {};
  let likes;

  const dispatch = createEventDispatcher();

  onMount(async () => {
    likes = await beerconomyService.getLikes(review._id);
    userProfile = await beerconomyService.getUserProfile(review.user); // THis value should be hashed in the review model
  });

  function stars(rating) {
    if (rating > 5) {
      rating = 5;
    }
    let icons = "";
    for (let i = 0; i < rating; i++) {
      icons += `<span class="icon"><i class="fas fa-star"></i></span>`;
    }
    return icons;
  }

  async function deleteReview() {
    const success = beerconomyService.deleteReview(review._id);
    if (!success) {
      alert("Something went wrong");
    } else {
      dispatch("reviewDeleted");
    }
  }

  async function likeReview() {
    const like = {
      review: review._id,
      user: $user.token,
    };
    const success = await beerconomyService.likeReview(review._id, like);

    if (success) {
      likes = await beerconomyService.getLikes(review._id);
    }
  }
</script>

<div class="card">
  {#if reviewOptions.candelete}
    <div class="is-flex is-justify-content-end" id="delete">
      <button class="button is-ghost" on:click={deleteReview}>
        <span class="icon">
          <ion-icon name="close-sharp" />
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
          {#if reviewOptions.username}
            <p class="title is-4" id="userName">{userProfile.userName}</p>
          {/if}
          <p class="subtitle is-7 is-italic" id="reviewRating">{getLongDate(review.date)}</p>
        </div>
      </div>
      <div class="content" id="reviewRating">{@html stars(review.rating)}</div>
    </div>
    <div class="content" id="reviewContent">{review.content}</div>
    <div class="columns">
      <div class="column is-flex is-justify-content-start" id="socials">
        {#if likes}
          <span class="icon is-tiny">
            <button on:click={likeReview} class="is-normal" id="like"><i class="fas fa-thumbs-up" /></button>
          </span>
          &ensp; {likes}
        {:else}
          <span class="icon is-tiny">
            <button on:click={likeReview} class="is-normal" id="Notlike"><i class="fas fa-thumbs-up" /></button>
          </span>
        {/if}
      </div>
      <div class="column is-flex is-justify-content-end" id="socials">
        <span class="tag">{review.place.placeName}</span>
      </div>
    </div>
  </div>
</div>

<style>
  .card {
    margin-top: 10px;
    margin-bottom: 10px;
    border-radius: 50px;
  }

  #like:hover {
    color: blue;
    transition: all 0.3s ease-in-out;
  }

  #like:active {
    border-color: black;
    outline: none !important;
  }

  #like:focus {
    border: none !important;
    outline: none !important;
  }

  #like {
    color: rgb(104, 104, 255);
    outline: none;
    border: none;
    background: none;
    cursor: pointer;
  }

  #Notlike:hover {
    color: blue;
    transition: all 0.3s ease-in-out;
  }

  #Notlike:active {
    border-color: black;
    outline: none !important;
  }

  #Notlike:focus {
    border: none !important;
    outline: none !important;
  }

  #Notlike {
    color: rgb(88, 88, 88);
    outline: none;
    border: none;
    background: none;
    cursor: pointer;
  }

  * {
    font-family: Helvetica, Arial, "Lucida Grande", sans-serif;
    font-weight: 500;
  }
</style>
