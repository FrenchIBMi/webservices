const { Connection, ProgramCall } = require("itoolkit");
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

  const program = new ProgramCall("CIUT0V", { lib: "CIL" });

  program.addParam({ value: getConfigurationFile, type: "256A" });
  program.addParam({ value: "", type: "256A" });
  program.addParam({
    value: "QCMDEXC   QSECOFR   *NOPWD    0",
    type: "256A",
  });

  connectioniToolkit.add(program);
  connectioniToolkit.run((error, xmlOutput) => {
    if (error) {
      res.status(500).send(JSON.stringify(error));
    } else {
      parseString(xmlOutput, (parseError, result) => {
        if (parseError) {
          res.status(500).send(JSON.stringify(parseError));
        }
        if (
          result.myscript.pgm[0].success &&
          result.myscript.pgm[0].parm[2].data[0]._ ==
            "QCMDEXC   QSECOFR   *NOPWD    1"
        ) {
          res.end("Génération du fichier : OK");
        } else {
        res.statusCode = 500;
        res.end("Erreur dans la génération du fichier");
        }
      });
    }
  });
}
