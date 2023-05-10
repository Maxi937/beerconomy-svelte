<script>
    import Map from "../components/Map.svelte";
    import {getContext} from "svelte";
    import { user } from "../stores";
  </script>


  <Map/>

  <div>
    email: { $user.email}
  </div>
