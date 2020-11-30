<script context="module">
  // Si déjà connecté -> redirection
  export async function preload(page, session) {    
    const { token } = session;

    if (token) {
      return this.redirect(302, "/");
    }
  }
</script>

<script>
  import { goto, stores } from "@sapper/app";
  import axios from "axios";
  import Header from "../../components/UI/Header.svelte";

  const { session } = stores();
  const titlePage = "Connexion";
  const login = false;

  let user = "";
  let password = "";
  let error;
  let valide = false;

  $: if (user.length > 0 && password.length > 0) {
    valide = true;
  } else {
    valide = false;
  }

  async function handleLogin(event) {
    await axios
      .post("auth/login", { user, password })
      .then(function(response) {
        if (response.data.error) {
          error = response.data.error.errorMessage;
        } else {
          $session.token = response.data.token;
          goto("/");
        }
      })
      .catch(function(error) {
        $session.token = null;
        error = error.errorMessage;
      });
  }
</script>

<svelte:head>
  <title>Connexion • Webservices</title>
</svelte:head>

<Header>{titlePage}</Header>

<div class="auth-page">
  <div class="container page">
    <div class="row">
      <div class="col s12 m6 offset-m3">
        <div class="card white">
          <div class="card-content">
            <form on:submit|preventDefault={handleLogin} method="post">
              <span class="card-title center-align">Log In</span>
              <label>
                Login
                <input type="text" bind:value={user} />
              </label>
              <label>
                Password
                <input type="password" bind:value={password} />
              </label>
              {#if error}
                <h6
                  class="center-align red-text red-lighten-2"
                  style="font-style: italic;">
                  {error}
                </h6>
              {/if}
              <div class="right-align">
                <button
                  class="btn waves-effect waves-light {!valide ? 'disabled' : ''} light-blue"
                  type="submit">
                  Login
                  <i class="material-icons right">send</i>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
