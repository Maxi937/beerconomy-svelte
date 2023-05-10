<script>
  import {setContext} from "svelte";
  import {BeerconomyService} from "./services/beerconomy-service";
  import TitleBar from "./components/TitleBar.svelte";
  import Main from "./pages/Main.svelte"
  import Login from "./pages/Login.svelte";
  import Router from "svelte-spa-router";
  import Logout from "./components/Logout.svelte";
  import Profile from "./pages/Profile.svelte";

  setContext("BeerconomyService", new BeerconomyService("http://localhost:4000"));


  let routes = {
    "/": Main,
    "/login": Login,
    "/logout": Logout,
    "/profile": Profile
  }
</script>

<TitleBar/>

<div class="container">
  <Router {routes}/>
</div>
