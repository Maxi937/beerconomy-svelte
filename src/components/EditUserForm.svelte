<script>
  import {createEventDispatcher, getContext, onMount} from "svelte";

  const beerconomyService = getContext("BeerconomyService");

  let message = "";
  let user = {};
  let fname = "";
  let lname = "";
  let email = "";

  onMount(async () => {
    user = await beerconomyService.getProfile();
  });

  async function updateDetails() {
    const newDetails = {
      fname,
      lname,
      email,
    };
    console.log(newDetails);
    const success = await beerconomyService.updateProfile(newDetails);
    if (!success) {
      message = "Something went wrong";
    } else {
      message = "Your details have been updated";
      user = await beerconomyService.getProfile();
      fname = "";
      lname = "";
      email = "";
    }
  }
</script>

{#if user}
  <form on:submit|preventDefault={updateDetails}>
    <div class="field">
      <p class="control has-icons-left">
        <input bind:value={fname} class="input" placeholder={user.fname} name="fname" id="fname" />
        <span class="icon is-small is-left">
          <i class="fas fa-lock" />
        </span>
      </p>
    </div>

    <div class="field">
      <p class="control has-icons-left">
        <input bind:value={lname} class="input" placeholder={user.lname} name="lname" id="lname" />
        <span class="icon is-small is-left">
          <i class="fas fa-lock" />
        </span>
      </p>
    </div>

    <div class="field">
      <p class="control has-icons-left">
        <input bind:value={email} class="input" placeholder={user.email} name="email" id="email" />
        <span class="icon is-small is-left">
          <i class="fas fa-lock" />
        </span>
      </p>
    </div>

    <br />

    <div class="field">
      <p class="control">
        <button class="button is-success"> Submit </button>
      </p>
    </div>
  </form>
{/if}

{#if message}
  <div class="section">
    <div class="box">
      {message}
    </div>
  </div>
{/if}
