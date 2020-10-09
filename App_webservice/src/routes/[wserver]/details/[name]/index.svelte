<script context="module">
  export function preload(page, session) {
  const {token, SERVER, PORT, SERVER_SUITE } = session;

    if (!token) {
      return this.redirect(302, "/login/");
    }

    const wserver = page.params.wserver;
    const url = `${SERVER}:${PORT}${SERVER_SUITE}${wserver}/${page.params.name}/details`;
    const wservice = page.params.name;

    return this.fetch(url)
      .then(res => {
        if (!res.ok) {
          throw new Error("Erreur lors du chargement !");
        }
        if (res.status === 200) {
          return res.json();
        }
      })
      .then(data => {
        const detailWebservice = data;
        return {
          detailWebservice: detailWebservice,
          wserver: wserver,
          wservice: wservice
        };
      })
      .catch(err => {
        console.log(err);
        this.error(500, "Erreur lors du chargement !");
      });
  }
</script>

<script>
  import axios from "axios";
  import Swal from "sweetalert2";

  // Components
  import Header from "../../../../components/UI/Header.svelte";
  import NotifyMessage from "../../../../components/UI/NotifyMessage.svelte";
  import CarteDetail from "../../../../components/CarteDetail.svelte";

  // Stores
  import { stores } from '@sapper/app';
  
  export let detailWebservice;
  export let wserver;
  export let wservice;

  const titlePage = "Détail d'un webservice";
  const { session } = stores();
  const { SERVER, PORT, SERVER_SUITE } = $session;
  let generationFichier = false;
  let codeServeur = "";
  let CommandInstall = "";

  function createConfigurationFile() {
    Swal.fire({
      title: "Génération",
      text: "Génération en cours ...",
      icon: "info",
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false
    });

    const url = `${SERVER}:${PORT}${SERVER_SUITE}${wserver}/${wservice}/crtCfg/`;

    axios({
      method: "get",
      url: url,
      mode: "cors"
    })
      .then(function(response) {
        Swal.close();
        Swal.fire({
          title: "Génération",
          text: "Génération terminée !",
          icon: "success",
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false
        });
        generationFichier = true;
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

  function sendConfigurationFile() {
    Swal.fire({
      title: "Envoi",
      text: "Envoi en cours ...",
      icon: "info",
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false
    });

    const url = `${SERVER}:${PORT}${SERVER_SUITE}${wserver}/${wservice}/envoiCfg?serverIBMi=${codeServeur}`;

    axios({
      method: "get",
      url: url,
      mode: "cors"
    })
      .then(function(response) {
        Swal.close();
        Swal.fire({
          title: "Envoi",
          text: "Envoi terminée !",
          icon: "success",
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false
        });
        // generationFichier = false;
        CommandInstall = response.data.CommandInstall;
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
</script>

<svelte:head>
  <title>{titlePage}</title>
</svelte:head>

<Header>{titlePage}</Header>

<section>
  <div class="row">
    <div class="left" style="padding-left: 1rem; padding-top:1rem;">
      <a
        href="{wserver}/"
        class="waves-effect waves-light btn"
        style="background-color: #34ace0;">
        <i class="material-icons left">arrow_back</i>
        retour
      </a>
    </div>
    <div class="right" style="padding-tight: 1rem; padding-top:1rem;">
      <a
        href="{wserver}/details/{wservice}/deploy"
        class="waves-effect waves-light btn"
        style="background-color: #34ace0;">
        <i class="material-icons right">send</i>
        Transférer
      </a>
    </div>
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
