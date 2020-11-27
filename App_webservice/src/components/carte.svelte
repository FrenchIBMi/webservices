<script>
  import { createEventDispatcher, afterUpdate } from "svelte";

  export let wserver;
  export let webservice;

  let start;

  $: if (webservice.status_svc == "Running") {
    start = true;
  } else {
    start = false;
  }

  const dispatch = createEventDispatcher();

  function startStopWebService() {
    dispatch("startStopWebService", { webservice: webservice, action: start });
  }

</script>

<style>
  .title {
    font-size: 2rem;
  }
  .libelle {
    font-weight: bolder;
  }
</style>

<div class="col s12 m6 l4 xl3">
  <div class="card ">
    <div
      class="card-content white-text {start ? 'green lighten-1' : 'red lighten-1'}" style="height: 9rem;">
      <span class="card-title activator white-text text-darken-4 title">
        {webservice.webservice}
        <i class="material-icons right">more_vert</i>
      </span>
      <p>{webservice.description_svc}</p>
    </div>

    <div class="card-reveal">
      <span class="card-title grey-text text-darken-4">
        {webservice.webservice}
        <i class="material-icons right">close</i>
      </span>
      <p>
        {#if webservice.properties_svc}
          <span class="libelle">Startup type:</span>
          {webservice.properties_svc.startup_type}
          <br />
          <span class="libelle">Runtime user ID:</span>
          {webservice.properties_svc.runtime_user_id}
          <br />
          <span class="libelle">Program object path:</span>
          {webservice.properties_svc.program_object_path}
          <br />
          <span class="libelle">Library list:</span>
          {webservice.properties_svc.library_list}
          <br />
        {/if}
      </p>
    </div>
    <div class="card-action">
      <div class="switch">
        <label>
          Arrêté
          <input
            type="checkbox"
            bind:checked={start}
            on:change={startStopWebService} />
          <span class="lever" />
          Démarré
        </label>
      </div>
      <div class="row" style="margin-bottom: 0px">
        <div class="col s1 right">
          <a href="{wserver}/details/{webservice.webservice}">
            <i
              class="material-icons right tooltipped"
              style="margin-top: -1em;"
              data-position="bottom"
              data-tooltip="Détails">
              more_horiz
            </i>
          </a>
        </div>
        <div class="col s1 right">
          <a href="{wserver}/details/{webservice.webservice}/deploy">
            <i
              class="material-icons right tooltipped"
              style="margin-top: -1em;"
              data-position="bottom"
              data-tooltip="Envoyer">
              send
            </i>
          </a>
        </div>
      </div>
    </div>
  </div>
</div>
