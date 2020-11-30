const { Connection, CommandCall } = require("itoolkit");
const { dbstmt, dbconn } = require("idb-connector");
const parseString = require("xml2js").parseString;
import utils from "../../../utils/utils";
import * as environnement from "../../../../stores/environnement.js";

const FileLibrary = environnement.FILE_LIBRARY;
const FileLog = environnement.FILE_LOG;

/**
 * Mise à jour des propriétés d'un webservice d'un webserver
 */
export async function post(req, res) {
  console.log(
    `MàJ Propriétés d'un webservice d'un webserver : ${JSON.stringify(
      req.params
    )}`
  );
//   console.log(`Body : ${JSON.stringify(req.body)}`);

  let erreur = false;
  let userid = req.body.userid;
  let libraryList = req.body.libraryList;
  let libraryListPosition = req.body.libraryListPosition;
  let startup = req.body.startup;

  if (req.body) {
    userid = req.body.userid;
    libraryList = req.body.libraryList;
    libraryListPosition = req.body.libraryListPosition;
    startup = req.body.startup;
  } else {
    erreur = true;
  }

  /**
   * @TODO : récupérer le body pour génération script
   *
   * setWebServiceProperties.sh
   * -server server-name -service service-name
   * [ -programObject program-object ]
   * [ -userid '*SERVER|*AUTHENTICATED|userid' ]
   * [ -host host-server ] [ -resetWSDL ]
   * [ -disableNillableWSDLElements] [ -disableOptionalWSDLElements ]
   * [ -addUnderscoreToWSDLElementNames ]
   * [ -libraryList library-list ] [ -libraryListPosition *FIRST|*LAST ]
   * [ -autoStartup true|false ] [ -connPoolCCSID *USERID|ccsid ]
   * [ -connPoolCleanupInterval cleanup-interval ]
   * [ -connPoolMaxConnections *NOMAX|max-connections ]
   * [ -connPoolMaxInactivity *NOMAX|max-inactivity ]
   * [ -connPoolMaxLifetime *NOMAX|max-lifetime ]
   * [ -connPoolMaxUseCount *NOMAX|max-use-count ]
   * [ -connPoolMaxUseTime *NOMAX|max-use-time ]
   * [ -connPoolFillCount fill-count ]
   * [ -connPoolUseThreads true|false ]
   * [ -transportMetadata *NONE|metadata-list ]
   * [ -transportHeaders *NONE|header-list ]
   * [ -printErrorDetails ] [ -help ]
   *
   * ATTENTION à bien redémarrer le webservice après.
   *
   *
   */

  // Constitution de la commande a exécuter
  if (!erreur) {
    let setWebServiceProperties = `/QIBM/ProdData/OS/WebServices/bin/setWebServiceProperties.sh -server '${req.params.wserver}' -service '${req.params.wservice}' `;
    if (userid && userid.trim() != "") {
      setWebServiceProperties += ` -userid '${userid}'`;
    }
    if (libraryList && libraryList.trim() != "") {
      // Remplacement des ";" par ":" comme indiqué dans la doc
      // Each library in the list must be delimited by a colon.
      const libraryList2 = libraryList.replace(/;/gi, ":");
      setWebServiceProperties += ` -libraryList '${libraryList2}' `;
    }
    if (libraryListPosition && libraryListPosition.trim != "") {
      setWebServiceProperties += ` -libraryListPosition '${libraryListPosition}' `;
    }
    if (startup != 'undefined') {
      setWebServiceProperties += ` -autoStartup '${startup}' `;
    }
    setWebServiceProperties += `| Rfile -wQ '${FileLibrary}/${FileLog}'`;

    const connectioniToolkit = new Connection(environnement.CONNEXION_API);
    const command = new CommandCall({
      type: "qsh",
      command: setWebServiceProperties,
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
            // res.end(retour.libelleStatut);

            // res.statusCode = 204;
            res.end(
              "Redémarrage du service nécessaire pour prendre en compte les modifications."
            );
          });
        }
      });
    } catch {
      res.statusCode = 500;
      res.end(JSON.stringify(result));
    }
  } else {
    res.statusCode = 400;
    res.end("Aucune information envoyée au serveur");
  }
}
