const { Connection, CommandCall } = require("itoolkit");
const parseString = require("xml2js").parseString;
import * as environnement from "../../../../stores/environnement.js";

/**
 * Génération du fichier de configuration
 */
export async function get(req, res) {
  console.log(
    `Génération du fichier de configuration d'un webservice d'un webserver : ${JSON.stringify(
      req.params
    )}`
  );

  // Récupération du chemin du fichier
  const FileConfiguration = environnement.CHEMIN_IFS;
  const getConfigurationFile = `QSH CMD('/QIBM/ProdData/OS/WebServices/bin/getConfigurationFile.sh -server ''${req.params.wserver}'' -locationDirectory ''${FileConfiguration}'' -serviceList ''${req.params.wservice}''')`;
  const connectioniToolkit = new Connection(environnement.CONNEXION_API);

  const command = new CommandCall({
    type: "qsh",
    command: getConfigurationFile,
  });

  connectioniToolkit.add(command);
  connectioniToolkit.run((error, xmlOutput) => {
    if (error) {
      res.status(500).send(JSON.stringify(error));
    } else {
      parseString(xmlOutput, (parseError, result) => {
        if (parseError) {
          res.status(500).send(JSON.stringify(parseError));
        }
        res.end("Génération du fichier : OK");
      });
    }
  });
}
