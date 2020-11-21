<script context="module">

  export function preload(page, session) {
    const { token } = session;

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
  import axios from "axios";
  import Swal from "sweetalert2";

  // Stores
  import { stores } from '@sapper/app';
  import * as environnement from "../../../../stores/environnement.js";

  // Components
  import Header from "../../../../components/UI/Header.svelte";
  import NotifyMessage from "../../../../components/UI/NotifyMessage.svelte";

  export let wserver;
  export let wservice;

  const titlePage = "Transfert d'un webservice";
  const listeServeurs = environnement.LISTE_SERVEURS;
  const { session } = stores();
  const { SERVER, PORT, SERVER_SUITE } = $session;

  let generationFichier = false;
  let codeServeur = "";
  let CommandInstall = "";
  let libraryList = "";
  let programObject = "";

  function createConfigurationFile() {
    Swal.fire({
      title: "Génération",
      text: "Génération en cours ...",
      icon: "info",
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false
    });

    // const url = `${SERVER}:${PORT}${SERVER_SUITE}${wserver}/${wservice}/crtCfg/`;

    axios
      .get(`API/${wserver}/${wservice}/crtCfg/`)
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

    // const url = `${SERVER}:${PORT}${SERVER_SUITE}${wserver}/${wservice}/envoiCfg?serverIBMi=${codeServeur}`;
    const url = `API/${wserver}/${wservice}/envoiCfg?serverIBMi=${codeServeur}`;

    const parametresConfiguration = {
      programObject,
      libraryList
    };

    axios
      .post(url, parametresConfiguration)
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
        CommandInstall = response.data.CommandInstall;
      })
      .catch(function(error) {
        // Fermeture du message d'attente
        Swal.close();

        // handle error
        console.log("server response : " + error);
        Swal.fire({
          title: "Erreur",
          text: "Le fichier n'a pas été généré !",
          icon: "error"
        });
      });
  }
</script>

<style>

</style>

<svelte:head>
  <title>{titlePage}</title>
</svelte:head>

<Header>{titlePage}</Header>

<section>
  <div class="row">
    <div class="col s1 left" style="padding-left: 1rem; padding-top:1rem;">
      <a
        href="{wserver}/"
        class="waves-effect waves-light btn"
        style="background-color: #34ace0;">
        <i class="material-icons left">arrow_back</i>
        retour
      </a>
    </div>
    <div class="col s10 center">
      <h4 style="color: #ff6d00">
        Transférer le webservice "{wservice}" sur une autre machine
      </h4>
    </div>
  </div>

  <div class="center" style="padding-bottom: 1rem;">
    <div class="center">
      <h6 style="font-style: italic;">1ème étape : Chemins</h6>
      <div class="row">
        <div class="input-field col s12">
          <input
            placeholder="/QSYS.LIB/LIBRARY.LIB/"
            id="programObject"
            type="text"
            bind:value={programObject}
            class="validate" />
          <label for="programObject">Chemin de l'objet (terminé par "/")</label>
        </div>
        <div class="col s12 input-field ">
          <textarea
            id="libraryList"
            class="materialize-textarea"
            placeholder="/QSYS.LIB/LIBRARY1.LIB;/QSYS.LIB/LIBRARY2.LIB;"
            bind:value={libraryList}
            data-length="120" />
          <label for="libraryList">
            Liste des bibliothèques (séparés par ";")
          </label>
        </div>
      </div>
    </div>
    <div class="center">
      <h6 style="font-style: italic;">2ème étape : Générer le fichier</h6>
      <div class="col s12">
        <button
          on:click|preventDefault={createConfigurationFile}
          class="waves-effect waves-light btn orange"
          style="margin-left: 1rem;">
          <i class="material-icons right">insert_drive_file</i>
          Générer
        </button>
      </div>
    </div>
  </div>
  {#if generationFichier}
    <div class="center">
      <h6 style="font-style: italic;">
        3ème étape : Sélectionner la machine de destination
      </h6>
      <div class="col s12">
        <div class="row center">
          {#each listeServeurs as serveur}
            <div class="col s3">
              <label>
                <input
                  name="serveur"
                  type="radio"
                  id="serveur"
                  value={serveur.code}
                  bind:group={codeServeur} />
                <span>{serveur.libelle}</span>
              </label>
            </div>
          {/each}
        </div>
      </div>
    </div>
    <div class="col s12 center" style="padding-bottom: 1rem;">
      <button
        on:click|preventDefault={sendConfigurationFile}
        class="waves-effect waves-light btn orange darken-4 {codeServeur.length > 0 ? '' : 'disabled'}"
        style="margin-left: 1rem;">
        <i class="material-icons right">send</i>
        Envoyer
      </button>
    </div>
  {/if}

  {#if CommandInstall.length > 0}
    <NotifyMessage>
      <h5 style="color: #ff6d00">
        Commande à exécuter sur la machine {codeServeur}
      </h5>
      {CommandInstall}
    </NotifyMessage>
  {/if}
</section>
