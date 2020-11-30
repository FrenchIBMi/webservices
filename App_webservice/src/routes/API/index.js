const { Connection, CommandCall } = require("itoolkit");
const { dbstmt, dbconn } = require("idb-connector");
const parseString = require("xml2js").parseString;

import * as environnement from "../../stores/environnement.js";

const FileLibrary = environnement.FILE_LIBRARY;
const FileServers = environnement.FILE_SERVERS;

export async function get(req, res) {
  console.log(`Liste des Webserveurs`);

  const listWebServicesServers = `/QIBM/ProdData/OS/WebServices/bin/listWebServicesServers.sh | Rfile -wQ '${FileLibrary}/${FileServers}'`;
  const connectioniToolkit = new Connection(environnement.CONNEXION_API);

  const command = new CommandCall({
    type: "qsh",
    command: listWebServicesServers,
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
          const sql = `select  substr(ldta, 1, LOCATE('(', ldta)-1) as "webserver"
                      , substr(ldta, LOCATE('(', ldta)+1, LOCATE(')', ldta) - LOCATE('(', ldta)-1) as "status_svr"
                  from ${FileLibrary}.${FileServers}
                  where ldta <> ''
                  for read only;`;

          const connectionDB2 = new dbconn(); // Create a connection object.
          connectionDB2.conn("*LOCAL"); // Connect to the database.

          const statement = new dbstmt(connectionDB2); // Create a statement object.

          let resultatSql = statement.execSync(sql);

          statement.close(); // Clean up the statement object.
          connectionDB2.disconn(); // Disconnect from the database.
          connectionDB2.close(); // Clean up the connection object.

          resultatSql = { webservers: resultatSql };
          res.end(JSON.stringify(resultatSql));
        });
      }
    });
  } catch {
    res.statusCode = 500;
    res.end(JSON.stringify(result));
  }
}
