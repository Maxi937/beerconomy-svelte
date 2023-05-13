<script>
  import { push } from "svelte-spa-router";
  import { createEventDispatcher, getContext } from "svelte";
  import { fade } from "svelte/transition";

  let email = "";
  let password = "";
  let message = "";
  const dispatch = createEventDispatcher();

  const beerconomyService = getContext("BeerconomyService");

  async function login() {
    let success = await beerconomyService.login(email, password);
    if (success) {
      push("/");
      dispatch("login");
    } else {
      email = "";
      password = "";
      message = "Invalid Credentials";
    }
  }
</script>

<form on:submit|preventDefault={login}>
  <div class="field">
    <label class="label" for="email">Email</label>
    <input bind:value={email} class="input" id="email" name="email" placeholder="Enter email" type="text" />
  </div>
  <div class="field">
    <label class="label" for="password">Password</label>
    <input bind:value={password} class="input" id="password" name="password" placeholder="Enter Password" type="password" />
  </div>
  <div class="field is-grouped">
    <button class="button is-link">Log In</button>
  </div>
  {#if message}
    <div class="box mt-5 has-background-danger has-text-white" transition:fade>
      {message}
    </div>
  {/if}
</form>
