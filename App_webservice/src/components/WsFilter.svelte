<script>
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  let filtreStart = true;
  let filtreStop = true;

  function filtrerStart(){
      filtreStart = !filtreStart;
      dispatch('filtrer', {filtreStart, filtreStop});
  }
  function filtrerStop(){
      filtreStop = !filtreStop;
      dispatch('filtrer', {filtreStart, filtreStop});
  }
</script>

<style>

</style>

<!-- <div class="center" style="padding-top:1rem;"> -->
  <button
    class="waves-effect waves-light btn {filtreStart ? 'green lighten-1' : 'grey darken-1'}"
    on:click={filtrerStart}>
    <i class="material-icons left">check</i>
    Démarrés
  </button>
  <button
    class="waves-effect waves-light btn {filtreStop ? 'red lighten-1' : 'grey darken-1'}"
    on:click={filtrerStop}>
    <i class="material-icons left">error_outline</i>
    Arrêtés
  </button>
<!-- </div> -->
