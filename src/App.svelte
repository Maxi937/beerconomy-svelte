<script>
  import {getContext, setContext} from "svelte";
  import { user } from "./stores";
  import {BeerconomyService} from "./services/beerconomy-service";
  import TitleBar from "./components/TitleBar.svelte";
  import Main from "./pages/Main.svelte"
  import Login from "./pages/Login.svelte";
  import Signup from "./pages/Signup.svelte";
  import Router, { push } from "svelte-spa-router";
  import Logout from "./components/Logout.svelte";
  import Profile from "./pages/Profile.svelte";
  import {wrap} from "svelte-spa-router/wrap"

  let url
  if (import.meta.env.dev) {
    url = import.meta.env.VITE_BACKEND_URL_DEV
  } else {
    url = import.meta.env.VITE_BACKEND_URL_PROD
  }

  setContext("BeerconomyService", new BeerconomyService(url));
  const beerconomyService = getContext("BeerconomyService");

async function checkTokenExpired() {
    const expired = await beerconomyService.checkTokenExpired($user.token)
    if (expired) {
      beerconomyService.logout()
      push("/")
    }
}

// TODO: there are pre conditions on the routes to check if the token has expired before proceeding, if the token is expired - logout() is called with deletes the user, a listener is needed to reresh the token or push back to login
// This solution is very basic and does not account for the token being expired whilst in a page and interacting with components.

  const routes = {
    "/": wrap({
      component: Main,
      conditions: [
        (detail) => {
          if($user.token) {
            checkTokenExpired()
          }
          return true
        }
      ]
    }),
    "/login": Login,
    "/logout": Logout,
    "/profile": wrap({
      component: Profile,
      conditions: [
        (detail) => {
          if($user.token) {
            checkTokenExpired()
          }
          return true
        }
      ]
    }),
    "/signup": Signup,
  }
</script>

<TitleBar/>

<div class="container">
  <Router {routes}/>
</div>
