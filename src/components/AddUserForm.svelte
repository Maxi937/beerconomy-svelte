<script>
  import { createEventDispatcher, getContext, onMount } from "svelte";
  import { push } from "svelte-spa-router";
  import { fade } from "svelte/transition";

  const beerconomyService = getContext("BeerconomyService");
  const dispatch = createEventDispatcher();

  let message;

  let newuser = {
    fname: "",
    lname: "",
    password: "",
    email: "",
  };

  async function addUser() {
    for (let [key, value] of Object.entries(newuser)) {
      if (value === "") {
        message = "Please fill in all fields";
        return [];
      }
    }
    console.log(newuser);

    const success = await beerconomyService.addUser(newuser);

    if (!success) {
      message = "Please use a different email";
      return []
    } 
      push("/");
      dispatch("signup")
  }
</script>

<h1 class="title">Sign up</h1>

<form on:submit|preventDefault={addUser}>
  <label class="label">Name</label>
  <div class="field is-horizontal">
    <div class="field-body">
      <div class="field">
        <input bind:value={newuser.fname} class="input" type="text" placeholder="Enter first name" name="fname" />
      </div>
      <div class="field">
        <input bind:value={newuser.lname} class="input" type="text" placeholder="Enter last name" name="lname" />
      </div>
    </div>
  </div>
  <div class="field">
    <label class="label">Email</label>
    <input bind:value={newuser.email} class="input" type="text" placeholder="Enter email" name="email" />
  </div>
  <div class="field">
    <label class="label">Password</label>
    <input bind:value={newuser.password} class="input" type="password" placeholder="Enter Password" name="password" />
  </div>
  <div class="field is-grouped">
    <button class="button is-link">Submit</button>
  </div>

  {#if message}
    <div class="box mt-5 has-background-danger has-text-white" transition:fade>
      {message}
    </div>
  {/if}
</form>
