<script context="module">
  export function preload(page, session) {
    const {token, SERVER, PORT, SERVER_SUITE } = session;

    if (!token) {
      return this.redirect(302, "/login/");
    }

    const wserver = page.params.wserver;
    const wservice = page.params.name;

    return {
      wserver: wserver,
      wservice: wservice
    };
  }
</script>

<script>
  import { onMount } from "svelte";

  import axios from "axios";
  import Swal from "sweetalert2";

  // Components
  import Header from "../../../../components/UI/Header.svelte";
  import NotifyMessage from "../../../../components/UI/NotifyMessage.svelte";
  import CarteDetail from "../../../../components/CarteDetail.svelte";

  // Stores
  import { stores } from '@sapper/app';
  
  export let wserver;
  export let wservice;
  
  let detailWebservice = null;
  let propertiesWebservice = null;

  const titlePage = "Détail d'un webservice";
  const { session } = stores();
  const { SERVER, PORT, SERVER_SUITE } = $session;

  let userid;
  let libraryList;
  let startup;
  let description;
  let libraryListPosition; // *FIRST | *LAST

  $: if (propertiesWebservice) {
    description = propertiesWebservice.wsproperties.description;
    userid = propertiesWebservice.wsproperties.runtime_user_id;
    libraryList = propertiesWebservice.wsproperties.library_list;
    libraryListPosition = propertiesWebservice.wsproperties.library_list_position;
    if (propertiesWebservice.wsproperties.startup_type == "Automatic") {
      startup = true;
    } else {
      startup = false;
    }
  }

  function setProperties() {
     Swal.fire({
      title: "Modification",
      text: "Modification en cours ...",
      icon: "info",
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false
    });

    // const url = `${SERVER}:${PORT}${SERVER_SUITE}${wserver}/${wservice}/setProperties`;

    console.log("modification");
    let newProperties = {
      userid,
      libraryList,
      libraryListPosition,
      startup
    };

    axios
      .post(`API/${wserver}/${wservice}/setProperties`, newProperties)
      .then(function(response) {
        Swal.close();
        Swal.fire({
          title: "Modification",
          text: "Redémarrage du service nécessaire pour prendre en compte les modifications.",
          icon: "success",
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false
        });
      })
      .catch(function(error) {
        // Fermeture du message d'attente
        Swal.close();

        // handle error
        console.log("server response : " + error);
        Swal.fire({
          title: "Erreur",
          text: "Les modifications n'ont pas été prises en compte!",
          icon: "error"
        });
      });
  }

  onMount(() => {
    Swal.fire({
      title: "Chargement",
      text: "Chargement des données...",
      icon: "info",
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
      showConfirmButton: false
    });

    // const url = `${SERVER}:${PORT}${SERVER_SUITE}${wserver}/${wservice}/details`;
    // const url2 = `${SERVER}:${PORT}${SERVER_SUITE}${wserver}/${wservice}/properties`;

    // axios({
    //   method: "get",
    //   url: url,
    //   mode: "cors"
    // })
    axios.get(`API/${wserver}/${wservice}/details`)
      .then(function(response) {
        detailWebservice = response.data;

        // Fermeture du message d'attente
        // Swal.close();
      })
      .catch(function(error) {
        // Fermeture du message d'attente
        Swal.close();

        // handle error
        console.log("server response : " + error);
        Swal.fire({
          title: "Erreur",
          text: "Impossible de récupérer les informations !",
          icon: "error"
        });
      });

    // axios({
    //   method: "get",
    //   url: url2,
    //   mode: "cors"
    // })
    axios.get(`API/${wserver}/${wservice}/properties`)
      .then(function(response) {
        propertiesWebservice = response.data;
        
        // Fermeture du message d'attente
        Swal.close();
      })
      .catch(function(error) {
        // Fermeture du message d'attente
        Swal.close();

        // handle error
        console.log("server response : " + error);
        Swal.fire({
          title: "Erreur",
          text: "Impossible de récupérer les informations !",
          icon: "error"
        });
      });

  })

</script>

<svelte:head>
  <title>{titlePage}</title>
</svelte:head>

<Header>{titlePage}</Header>

<section>
  <div class="row">
    <div class="col s2" style="padding-left: 1rem; padding-top:1rem;">
      <a
        href="{wserver}/"
        class="waves-effect waves-light btn"
        style="background-color: #34ace0;">
        <i class="material-icons left">arrow_back</i>
        retour
      </a>
    </div>
    <div class="col s8 center">
      <h4 style="color: #ff6d00">
        {description}
      </h4>
    </div>
    <div class="col s2" style="padding-right: 1rem; padding-top:1rem;">
      <a
        href="{wserver}/details/{wservice}/deploy"
        class="waves-effect waves-light btn"
        style="background-color: #34ace0;">
        <i class="material-icons right">send</i>
        Transférer
      </a>
    </div>
  </div>
  
  <div class="row left-align">
    <h5 style="color: #00897b; margin-left: 1rem;">
      Propriétés
    </h5>
  </div>

  <div class="switch">
    <label>
      Arrêté
      <input
        type="checkbox"/>
      <span class="lever" />
      Démarré
    </label>
  </div>

  {#if propertiesWebservice}
    <div class="row" style="margin-bottom: 0;">
      <div class="col s12">
        <div class="col s2" style="font-style: italic;">Chemin d'installation :</div>
        <div class="col s10" >{propertiesWebservice.wsproperties.install_path}</div>
      </div>
      <div class="col s12">
        <div class="col s2" style="font-style: italic;">Programme : </div>
        <div class="col s10" > {propertiesWebservice.wsproperties.program_object_path}</div>
      </div>
      <div class="col s12">
        <div class="col s2" style="font-style: italic;">Statut :</div>
        <div class="col s10" style={propertiesWebservice.wsproperties.status == "Running" ? "color: #66bb6a;" : "color: #ef5350;"}> {propertiesWebservice.wsproperties.status}</div>
      </div>
      <div class="col s12">
        <div class="col s2" style="font-style: italic;">Type démarrage : </div>
        <!-- <div class="col s10">
          <label>
            <input name="startup" bind:group={startup} type="radio" value={true}/>
            <span>Automatique</span>
          </label>
          <label>
            <input name="startup" bind:group={startup} type="radio" value={false} />
            <span>Manuel</span>
          </label>
        </div> -->
        <div class="switch">
          <label>
            Arrêté
            <input
              type="checkbox"
              bind:checked={startup} />
            <span class="lever" />
            Démarré
          </label>
        </div>
      </div>
      <div class="col s12">
        <div class="input-field col s12">
          <label class="active" for="userid">Utilisateur</label>
          <input
            id="userid"
            type="text"
            bind:value={userid} class="validate">
        </div>
      </div>
      <div class="col s12">
        <div class="input-field col s12">
          <textarea 
            id="libraryList" 
            class="materialize-textarea" 
            bind:value={libraryList}
            data-length="120"></textarea>
          <label for="libraryList" class="active">Liste des bibliothèques (séparés par ";") </label>
        </div>
      </div>
      <div class="col s12">
        <div class="col s2" style="font-style: italic;">Position de la liste de bibliothèque : </div>
        <div class="col s10">
          <label>
            <input name="libraryListPosition" bind:group={libraryListPosition} type="radio" value={'*FIRST'}/>
            <span>Début</span>
          </label>
          <label>
            <input name="libraryListPosition" bind:group={libraryListPosition} type="radio" value={'*LAST'} />
            <span>Fin</span>
          </label>
        </div>
      </div>
    </div>
    <div class="row left-align" style="padding-tight: 1rem; padding-top:1rem;">
      <button 
        class="waves-effect waves-light btn btn orange darken-4"
        style="margin-left: 1rem;"
        on:click|preventDefault={setProperties}>
        <i class="material-icons left">edit</i>
        Modifier
      </button>
    </div>
  {:else}
    <NotifyMessage>Propriétés inconnues.</NotifyMessage>
  {/if}

  <div class="divider"></div>

  <div class="row left-align">
    <h5 style="color: #00897b; margin-left: 1rem;">
      Méthodes
    </h5>
  </div>
  <div>
    {#if detailWebservice}
      <div class="row">
        {#each detailWebservice.wsentrypoints as detailWs}
          <section id="detailWebserver">
            <CarteDetail {detailWs} />
          </section>
        {/each}
      </div>

    {:else}
      <NotifyMessage>Pas de détails !</NotifyMessage>
    {/if}

  </div>
</section>
