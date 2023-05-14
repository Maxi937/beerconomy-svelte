<script>
  import { createEventDispatcher } from "svelte";

  import AddUserForm from "../components/AddUserForm.svelte";
  import LoginForm from "./LoginForm.svelte";

  let login;
  let signup;
  let anyformopen;
  const dispatch = createEventDispatcher();

  function showLogin() {
    anyformopen = true;
    login = true;
  }

  function showSignup() {
    anyformopen = true;
    signup = true;
  }

  function finish() {
    console.log("finish");
    //dispatch("loginSignupControlFinished");
  }
</script>

{#if !anyformopen}
  <div class="columns is-mobile is-centered">
    <div class="column has-text-right">
      <button on:click={showLogin} class="button is-primary has-text-centered">Login</button>
    </div>
    <div class="column has-text-left">
      <button on:click={showSignup} class="button is-link has-text-centered">Signup</button>
    </div>
  </div>
{/if}

{#if login}
  <LoginForm on:login={finish} />
{/if}

{#if signup}
  <AddUserForm on:signup={finish} />
{/if}

<style>
  .button {
    width: 100%;
  }
</style>
