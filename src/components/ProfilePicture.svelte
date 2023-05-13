<script>
  import { createEventDispatcher, getContext, onMount } from "svelte";

  const beerconomyService = getContext("BeerconomyService");

  let message = "";
  let profilepicture = {};
  let uploads;

  onMount(async () => {
    profilepicture = await beerconomyService.getProfilePicture();
  });

  async function updateProfilePicture() {
    const success = await beerconomyService.updateProfilePicture(uploads[0]);

    if (!success) {
      message = "Something went wrong";
    } else {
      uploads = [];
      profilepicture = await beerconomyService.getProfilePicture();
    }
  }
</script>

<div class="box">
  <form on:submit|preventDefault={updateProfilePicture} enctype="multipart/form-data">

    <div class="columns">
      <div class="column is-flex is-justify-content-start">
      <div id="profilepicture" class="file has-name">
        <label class="file-label">
          <input bind:files={uploads} class="file-input" type="file" name="profilepicture" accept="image/jpeg,image/gif,image/png,application/pdf,image/x-eps" />
          <span class="file-cta">
            <span class="file-icon">
              <i class="fas fa-upload" />
            </span>
            <span class="file-label">  </span>
          </span>
          {#if uploads && uploads[0]}
            <span class="file-name"> {uploads[0].name} </span>
          {/if}
        </label>
      </div>
    </div>

    <div class="column is-flex is-justify-content-end">
      <div class="field">
        <p class="control">
          <button class="button is-ghost"> Submit </button>
        </p>
      </div>
    </div>
  </div>
  </form>

  <br>
  <figure class="image is-flex is-justify-content-center">
    <img class="is-rounded" src="data:{profilepicture.contentType};base64,{profilepicture.data}" alt="Placeholder" style="width:280px; height:280px;" />
  </figure>
</div>

{#if message}
  <div class="section">
    <div class="box">
      {message}
    </div>
  </div>
{/if}
