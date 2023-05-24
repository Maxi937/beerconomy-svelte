<script>
  import { createEventDispatcher, getContext, onMount } from "svelte";
  import { blur } from "svelte/transition";

  const beerconomyService = getContext("BeerconomyService");

  let message = "";
  let user = {};
  let fname = "";
  let lname = "";
  let email = "";
  let submitted = false;

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
      user = await beerconomyService.getProfile();
      submitted = true;
      fname = "";
      lname = "";
      email = "";
    }
  }
</script>

<div class="block">
  <p class="Header">Your Details</p>
</div>

{#if user}
  <form on:submit|preventDefault={updateDetails}>
    <div class="field">
      <p class="control has-icons-left">
        {#if !submitted}
          <input bind:value={fname} class="input" placeholder={user.fname} name="fname" id="fname" />
          <span class="icon is-small is-left">
            <i class="fas fa-user" />
          </span>
        {:else}
          <input disabled class="input" placeholder={user.fname} />
          <span class="icon is-small is-left">
            <i class="fas fa-lock" />
          </span>
        {/if}
      </p>
    </div>

    <div class="field">
      <p class="control has-icons-left">
        {#if !submitted}
          <input bind:value={lname} class="input" placeholder={user.lname} name="lname" id="lname" />
          <span class="icon is-small is-left">
            <i class="fas fa-user" />
          </span>
        {:else}
          <input disabled class="input" placeholder={user.lname} />
          <span class="icon is-small is-left">
            <i class="fas fa-lock" />
          </span>
        {/if}
      </p>
    </div>

    <div class="field">
      <p class="control has-icons-left">
        {#if !submitted}
          <input bind:value={email} class="input" placeholder={user.email} name="email" id="email" />
          <span class="icon is-small is-left">
            <i class="fas fa-envelope" />
          </span>
        {:else}
          <input disabled class="input" placeholder={user.email} />
          <span class="icon is-small is-left">
            <i class="fas fa-lock" />
          </span>
        {/if}
      </p>
    </div>

    <div class="submitButton field has-text-centered">
      {#if !submitted}
        <p class="control">
          <button class="button is-info"> Submit </button>
        </p>
      {:else}
        <span class="icon is-small is-left" transition:blur>
          <i class="fas fa-check" />
        </span>
      {/if}
    </div>
  </form>
{/if}

{#if message}
  <div class="box" transition:blur>
    {message}
  </div>
{/if}

<style>
  .submitButton {
    margin-top: 15%;
    transition: all 0.4s ease-in-out;
  }

  .button:hover {
    background-color: aquamarine;
    color: black;
    transition: all ease 0.4s;
  }

  .Header {
    margin: auto;
    width: 50%;
    background-color: aquamarine;
    border-radius: 10px;
    padding: 5px;
    text-align: center;
    margin-bottom: 6px;
    font-family: Helvetica, Arial, "Lucida Grande", sans-serif;
    font-weight: 500;
  }
</style>
