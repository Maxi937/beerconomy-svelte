<script>
  import { getContext } from "svelte";
  import { push } from "svelte-spa-router";

  const beerconomyService = getContext("BeerconomyService");
  beerconomyService.logout();
  push("/");
</script>
