<script context="module">
  export function preload(page, session) {
    const { token } = session;

    if (!token) {
      return this.redirect(302, "/login/");
    }

    return { wserver: page.params.wserver };
  }
</script>

<script>
  // Import des CSS

  import { onMount } from "svelte";
  import axios from "axios";
  import Swal from "sweetalert2";
  import Header from "../../components/UI/Header.svelte";
  import NotifyMessage from "../../components/UI/NotifyMessage.svelte";

  // Animations / Transitions
  import { flip } from "svelte/animate";
  import { scale } from "svelte/transition";

  //scripts

  // Components
  import Carte from "../../components/Carte.svelte";
  import WsFilter from "../../components/WsFilter.svelte";

  // Stores
  import { stores } from '@sapper/app';
  import webservices from "../../stores/webservices.js";
  import * as environnement from "../../stores/environnement.js";

  export let wserver;

  /**
   * Variables
   */
  const titlePage = "Liste des webservices";
  const link = "/";
  const login = true;

  const { session } = stores();

  const { SERVER, PORT, SERVER_SUITE } = $session;

  let startFilter = true; // Bouton de filtre "Démarrés"
  let stopFilter = true; // Bouton de filtre "Arrêtés"
  let loadedWebservices = []; // liste des webservices chargés à partir de l'API
  let filteredWebservices = []; // liste des webservices filtrés

  const unsubscribe = webservices.subscribe(items => {
    loadedWebservices = items;
  });

  /**
   * Arrêt/Démarrage d'un webservice
   */
  function startStopWebService(event) {
    let title = "Démarrage";
    let text = "Démarrage en cours...";
    let url = `${SERVER}:${PORT}${SERVER_SUITE}${wserver}/${event.detail.webservice.webservice}/`;

    if (event.detail.action) {
      title = "Arrêt";
      text = "Arrêt en cours ...";
      url += "stop";
    } else {
      url += "start";
    }

    Swal.fire({
      title: title,
      text: text,
      icon: "info",
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false
    });

    axios({
      method: "get",
      url: url,
      mode: "cors"
    })
      .then(function(response) {
        // Mise à jour des infos dans le store afin d'éviter de recharger la liste (gain de performance)
        let index = filteredWebservices.indexOf(event.detail.webservice);
        if (index >= 0) {
          if (index >= 0) {
            if (filteredWebservices[index].status_svc == "Running") {
              webservices.updateStatus(
                event.detail.webservice.webservice,
                "Stopped"
              );
            } else {
              webservices.updateStatus(
                event.detail.webservice.webservice,
                "Running"
              );
            }
          }
        }

        // Re-calcul du filtre suite à la mise à jour du store
        filteredWebservices = filtrerWebservices(
          loadedWebservices,
          startFilter,
          stopFilter
        );

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
          text: "Arrêt/Démarrage impossible !",
          icon: "error"
        });
      });
  }

  /**
   * Clique sur un bouton de filtre
   */
  function filtrer(event) {
    // Mise à jour des variables filtres
    startFilter = event.detail.filtreStart === true;
    stopFilter = event.detail.filtreStop === true;

    // Appel de la fonction pour filtrer
    filteredWebservices = filtrerWebservices(
      loadedWebservices,
      event.detail.filtreStart,
      event.detail.filtreStop
    );
  }

  /**
   * Filtre des webservices
   */
  function filtrerWebservices(webserviceList, startValue, stopValue) {
    let webserviceListFiltre = [];
    if (startValue === true && stopValue === true) {
      webserviceListFiltre = webserviceList;
    } else if (startValue != stopValue) {
      if (startValue === true) {
        webserviceListFiltre = webserviceList.filter(elem => {
          return elem.status_svc == "Running";
        });
      }

      if (stopValue === true) {
        webserviceListFiltre = webserviceList.filter(elem => {
          return elem.status_svc == "Stopped";
        });
      }
    } else {
      webserviceListFiltre = [];
    }

    return webserviceListFiltre;
  }

  // Au chargement
  onMount(() => {
    // Affichage d'un message d'attente
    Swal.fire({
      title: "Chargement",
      text: "Chargement des données...",
      icon: "info",
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
      showConfirmButton: false
    });
    // let url = `${SERVER}:${PORT}${SERVER_SUITE}${wserver}/`;

    // axios({
    //   method: "get",
    //   url: url,
    //   mode: "cors"
    // })
    axios.get(`API/${wserver}/`)
      .then(function(response) {
        loadedWebservices = response.data.webservices;
        filteredWebservices = response.data.webservices;
        webservices.setWebservices(loadedWebservices);
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
  });
</script>

<style>

</style>

<svelte:head>
  <title>{titlePage}</title>
</svelte:head>

<Header>{titlePage}</Header>

<section>
  <div class="row">
    <div class="center" style="padding-top:1rem;">
      <WsFilter on:filtrer={filtrer} />
      <div class="left" style="padding-left: 1rem;">
        <a
          href="/"
          class="waves-effect waves-light btn"
          style="background-color: #34ace0;">
          <i class="material-icons left">arrow_back</i>
          retour
        </a>
      </div>
    </div>
  </div>
  <div class="row">
    {#each filteredWebservices as webservice (webservice.webservice)}
      <div transition:scale animate:flip={{ duration: 300 }}>
        <!-- Card -->
        <section id="webservices">
          <Carte
            {wserver}
            {webservice}
            on:startStopWebService={startStopWebService} />
        </section>
      </div>
    {:else}
      <NotifyMessage>Pas de webservices !</NotifyMessage>
    {/each}
  </div>
</section>
