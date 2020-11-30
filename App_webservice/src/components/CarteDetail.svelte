<script>
  export let detailWs;
</script>

<div class="col s12 xl6">
  <div class="card-panel teal" style="background-color: #40739e !important">
    <span class="white-text">
      <h5 class="center">{detailWs.entryPoint}</h5>
      <p>HTTP Request method : {detailWs.restHttpRequestMethod}</p>
      <p>URI Path template : {detailWs.restUriPathTemplate}</p>
      <p>Return output media type : {detailWs.restProduces}</p>

      <table class="striped responsive-table">
        <thead>
          <tr>
            <th class="center">Parameter name</th>
            <th class="center">I/O</th>
            <th class="center">Data type</th>
            <th class="center">Data length</th>
            <th class="center">Input source</th>
            <th class="center">Identifier</th>
            <th class="center">Default value</th>
          </tr>
        </thead>
        <tbody>
          {#each detailWs.champs as champ}
            <tr>
              <td>{champ.nom_variable}</td>
              <td class="center">{champ.entree_sortie}</td>
              <td>{champ.type_variable}</td>
              <td class="center">{champ.longueur}</td>
              <td>{champ.type_parametre}</td>
              <td>{champ.nom_parametre}</td>
              <td>{champ.valeur_defaut}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </span>
  </div>
</div>
