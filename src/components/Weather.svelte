<script>
  import { onMount } from "svelte";

  export let weather;
</script>

{#if weather}
  <div class="is-flex columns" id="popup">
    <div class="column is-narrow">
      <div class="columns is-gapless">
        <div class="column is-narrow">
          <span class="material-symbols-outlined"> thermometer </span>
        </div>
        <div class="column is-narrow">
          <div class="tag is-tiny">
            <p class="is-italic">{weather.temperature}&#176;</p>
          </div>
        </div>
      </div>
    </div>

    {#if weather.wind}
      <div class="column is-narrow">
        <div class="columns is-gapless">
          <div class="column is-narrow">
            <figure class="image is-32x32">
              <span class="material-symbols-outlined"> air </span>
            </figure>
          </div>
          <div class="column is-narrow">
            <div class="tag is-tiny">
              <p class="is-italic">{weather.wind.speed} km/h</p>
            </div>
          </div>
        </div>
      </div>
    {/if}

    <div class="column is-narrow">
      <div class="columns is-gapless">
        <div class="column is-narrow">
          <figure class="image is-32x32">
            <span class="material-symbols-outlined"> info </span>
          </figure>
        </div>
        <div class="column is-narrow">
          <div class="tag is-tiny">
            <p class="is-italic">{weather.weatherdescription}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}
