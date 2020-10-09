<script context="module">
  export function preload(page, session) {
    const { token } = session;
    if (!token) {
      return this.redirect(302, "/login");
    }
  }
</script>

<script>
  // Import des CSS

  import { onMount } from "svelte";
  import axios from "axios";
  import Swal from "sweetalert2";
  import Header from "../components/UI/Header.svelte";
  import NotifyMessage from "../components/UI/NotifyMessage.svelte";

  // Animations / Transitions
  import { flip } from "svelte/animate";
  import { scale } from "svelte/transition";

  //scripts

  // Components
  import Carte from "../components/wserverCarte.svelte";
  import WsFilter from "../components/WsFilter.svelte";

  // Stores
  import { stores } from '@sapper/app';
  import webservers from "../stores/webservers.js";

  /**
   * Variables
   */
  const titlePage = "Liste des webservers";
  const login = true;

  let startFilter = true; // Bouton de filtre "Démarrés"
  let stopFilter = true; // Bouton de filtre "Arrêtés"
  let loadedWebservers = []; // liste des webservices chargés à partir de l'API
  let filteredWebservers = []; // liste des webservices filtrés

  const unsubscribe = webservers.subscribe(items => {
    loadedWebservers = items;
  });

  const { session } = stores();
  const { SERVER, PORT, SERVER_SUITE } = $session;

  console.log('Port : ' + PORT);

  // Arrêt/Démarrage d'un webservice
  function startStopWebServer(event) {
    let title = "Démarrage";
    let text = "Démarrage en cours...";
    let url = `${SERVER}:${PORT}${SERVER_SUITE}${event.detail.webserver.webserver.trim()}/`;

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
        let index = filteredWebservers.indexOf(event.detail.webserver);
        if (index >= 0) {
          if (index >= 0) {
            if (filteredWebservers[index].status_svr == "Running") {
              webservers.updateStatus(
                event.detail.webserver.webserver,
                "Stopped"
              );
            } else {
              webservers.updateStatus(
                event.detail.webserver.webserver,
                "Running"
              );
            }
          }
        }

        // Re-calcul du filtre suite à la mise à jour du store
        filteredWebservers = filtrerWebservers(
          loadedWebservers,
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
          text: "Contacter le CIL!",
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
    filteredWebservers = filtrerWebservers(
      loadedWebservers,
      event.detail.filtreStart,
      event.detail.filtreStop
    );
  }

  /**
   * Filtre des webservers
   */
  function filtrerWebservers(webserverList, startValue, stopValue) {
    let webserverListFiltre = [];
    if (startValue === true && stopValue === true) {
      webserverListFiltre = webserverList;
    } else if (startValue != stopValue) {
      if (startValue === true) {
        webserverListFiltre = webserverList.filter(elem => {
          return elem.status_svr == "Running";
        });
      }

      if (stopValue === true) {
        webserverListFiltre = webserverList.filter(elem => {
          return elem.status_svr == "Stopped";
        });
      }
    } else {
      webserverListFiltre = [];
    }

    return webserverListFiltre;
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
    let url = `${SERVER}:${PORT}${SERVER_SUITE}`;

    // Récupération des webservers
    axios({
      method: "get",
      url: url,
      mode: "cors"
    })
      .then(function(response) {
        loadedWebservers = response.data.webservers;
        filteredWebservers = response.data.webservers;
        webservers.setWebservers(loadedWebservers);
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
          text: "Contacter le CIL!",
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
    </div>
  </div>
  <div class="row">
    {#each filteredWebservers as webserver (webserver.webserver)}
      <div transition:scale animate:flip={{ duration: 300 }}>
        <!-- Card -->
        <section id="webservers">
          <Carte {webserver} on:startStopWebServer={startStopWebServer} />
        </section>
      </div>
    {:else}
      <NotifyMessage>Pas de webservers !</NotifyMessage>
    {/each}
  </div>
</section>
