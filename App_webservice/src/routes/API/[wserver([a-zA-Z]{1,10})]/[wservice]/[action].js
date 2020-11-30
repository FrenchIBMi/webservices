const { Connection, CommandCall } = require("itoolkit");
const { dbstmt, dbconn } = require("idb-connector");
const parseString = require("xml2js").parseString;
import utils from "../../../utils/utils";
import * as environnement from "../../../../stores/environnement.js";

const FileLibrary = environnement.FILE_LIBRARY;
const FileLog = environnement.FILE_LOG;

/**
 * Arrêt / Démarrage d'un webservice
 */
export async function get(req, res) {
  console.log(
    `Arrêt/Démarrage d'un webservice d'un webserver : ${JSON.stringify(
      req.params
    )}`
  );

  let startStopWebService = "/QIBM/ProdData/OS/WebServices/bin/";
  let erreur = false;

  switch (req.params.action.toUpperCase()) {
    case "START":
      startStopWebService += "startWebService";
      break;
    case "STOP":
      startStopWebService += "stopWebService";
      break;
    default:
      res.statusCode = 400;
      res.end("Action inconnue");
      erreur = true;
      break;
  }

  if (!erreur) {
    startStopWebService += `.sh -server '${req.params.wserver}' -service '${req.params.wservice}' | Rfile -wQ '${FileLibrary}/${FileLog}'`;

    const connectioniToolkit = new Connection(environnement.CONNEXION_API);

    const command = new CommandCall({
      type: "qsh",
      command: startStopWebService,
    });

    connectioniToolkit.add(command);

    try {
      connectioniToolkit.run((error, xmlOutput) => {
        if (error) {
          throw error;
        } else {
          parseString(xmlOutput, (parseError, result) => {
            if (parseError) {
              throw parseError;
            }
            const sql = `select trim(substr(LDTA, 1, 9)) as "ldta"
                          from ${FileLibrary}.${FileLog}
                        where trim(ldta) <> ''
                        for read only;`;

            const connectionDB2 = new dbconn(); // Create a connection object.
            connectionDB2.conn("*LOCAL"); // Connect to the database.

            const statement = new dbstmt(connectionDB2); // Create a statement object.

            let resultatSql = statement.execSync(sql);

            statement.close(); // Clean up the statement object.
            connectionDB2.disconn(); // Disconnect from the database.
            connectionDB2.close(); // Clean up the connection object.

            const retour = utils.checkStatus(resultatSql[0].ldta);
              res.statusCode = retour.codeStatut;
              res.end(retour.libelleStatut);
          });
        }
      });
    } catch {
      res.statusCode = 500;
      res.end("Erreur dans la commande");
    }
  }
}