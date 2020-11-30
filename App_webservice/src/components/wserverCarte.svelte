<script>
  import { onMount, createEventDispatcher } from "svelte";
  import axios from "axios";

  // Stores
  import { stores } from '@sapper/app';

  export let webserver;

  const { session } = stores();
  const { SERVER, PORT, SERVER_SUITE } = $session;

  let start;
  let wsProperties = {};

  $: if (webserver.status_svr == "Running") {
    start = true;
  } else {
    start = false;
  }
  const dispatch = createEventDispatcher();

  function startStopWebServer() {
    dispatch("startStopWebServer", { webserver: webserver, action: start });
  }

  onMount(() => {
    let url = `${SERVER}:${PORT}${SERVER_SUITE}${webserver.webserver.trim()}/properties`;
    // Récupération des propriétés du webserver
    axios({
      method: "get",
      url: url,
      mode: "cors"
    })
      .then(function(response) {
        wsProperties = response.data.wsrvproperties;
      })
      .catch(function(error) {
        // handle error
        console.log("server response : " + error);
      });
  });
</script>

<style>
  .title {
    font-size: 2rem;
  }
  .libelle {
    font-weight: bolder;
  }
</style>

<div class="col s12 m3">
  <div class="card ">
    <div
      class="card-content white-text {start ? 'green lighten-1' : 'red lighten-1'}">
      <span class="card-title activator white-text text-darken-4 title">
        {webserver.webserver.trim()}
        <i class="material-icons right">more_vert</i>
      </span>
    </div>

    <div class="card-reveal">
      <span class="card-title grey-text text-darken-4">
        {webserver.webserver.trim()}
        <i class="material-icons right">close</i>
      </span>
      <p>
        {#if wsProperties}
          <span class="libelle">Runtime user ID:</span>
          {wsProperties.runtime_user_id}
          <br />
          <span class="libelle">Instance path:</span>
          {wsProperties.instance_path}
          <br />
          <span class="libelle">Install path:</span>
          {wsProperties.webservices_install_path}
          <br />
          <span class="libelle">Subsystem:</span>
          {wsProperties.subsystem}
          <br />
          <span class="libelle">Log file name:</span>
          {wsProperties.log_file_name}
          <br />
          <span class="libelle">HTTP server name:</span>
          {wsProperties.http_name}
          <br />
          <span class="libelle">HTTP server ports:</span>
          {wsProperties.http_ports}
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
            on:change={startStopWebServer} />
          <span class="lever" />
          Démarré
        </label>
      </div>
      <span>
        <a href="{webserver.webserver.trim()}/">
        <i class="material-icons right" style="margin-top: -1em;">more_horiz</i>
        </a>
      </span>
    </div>
  </div>
</div>
