<script>
  import { goto, stores } from "@sapper/app";
  import axios from "axios";

  const { session } = stores();

  async function logout() {
    // await post(`auth/logout`);
    await axios
      .post("auth/logout")
      .then(function(response) {})
      .catch(function(error) {
        error = error.message;
      })
      .finally(function() {
        $session.token = null;
        goto("/");
      });
  }
</script>

<style>
  nav {
    background-color: #34ace0;
  }
  @media only screen and (max-width: 760px) {
    nav .brand-logo {
      font-size: 1.1rem;
    }
  }
</style>

<div class="navbar-fixed">
  <nav>
    <div class="nav-wrapper">
      <div class="col s12" style="padding-left: 1rem;">
        <a href="/" class="brand-logo">
          <slot />
        </a>
        {#if $session.token}
          <ul id="nav-mobile" class="right">
            <li>
              <a href="#" on:click={logout}>
                <i class="material-icons">power_settings_new</i>
              </a>
            </li>
          </ul>
        {/if}
        <!-- <ul id="nav-mobile" class="right hide-on-med-and-down">
      <li>
        <a href="sass.html">Sass</a>
      </li>
      <li>
        <a href="badges.html">Components</a>
      </li>
      <li>
        <a href="collapsible.html">JavaScript</a>
      </li>
    </ul> -->
      </div>
    </div>
  </nav>
</div>
