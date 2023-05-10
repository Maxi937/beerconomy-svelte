<script>
  import {user} from "../stores.js"
</script>


{#if $user.email}
<div class="box"  id="menu-container"> 
<nav class="navbar">
  <div class="navbar-brand">
    <div class="title p-3 is-flex">
      <i style="font-size: 32px; color: rgb(0, 0, 0);" class="fas fa-beer"></i>
      <div class="ml-4">Pint Accountant</div>
    </div>
  </div>
  <div class="navbar-menu" id="navMenu">
    <div class="navbar-end">
      <div class="navbar-item">
        <div class="buttons">
          <a id="login" class="button" href="/#/"> Dashboard </a>
          <a id="about" class="button" href="/#/about"> About </a>
          <a id="profile" class="button" href="/#/profile"> Profile </a>
          <a id="logout" class="button" href="/#/logout"> Logout </a>
        </div>
      </div>
    </div>
  </div>
</nav>
</div>
{:else}
<div class="box"  id="menu-container"> 
  <nav class="navbar">
    <div class="navbar-brand">
      <div class="title p-3 is-flex">
        <i style="font-size: 32px; color: rgb(0, 0, 0);" class="fas fa-beer"></i>
        <div class="ml-4">Pint Accountant</div>
      </div>
    </div>
    <div class="navbar-menu" id="navMenu">
      <div class="navbar-end">
        <div class="navbar-item">
          <div class="buttons">
            <a class="button" id="home" href="/"> Home </a>
            <a class="button" id="login" href="/#/login"> Log in </a>
            <a class="button" id="signup" href="/#/signup"> Sign up </a>
          </div>
        </div>
      </div>
    </div>
  </nav>
  </div>
{/if}

<style>

</style>