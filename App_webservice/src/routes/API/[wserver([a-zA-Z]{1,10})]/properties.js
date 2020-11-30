const { Connection, CommandCall } = require("itoolkit");
const { dbstmt, dbconn } = require("idb-connector");
const parseString = require("xml2js").parseString;
import * as environnement from "../../../stores/environnement.js";

const FileLibrary = environnement.FILE_LIBRARY;
const FileProperties = environnement.FILE_PROPERTIES;

/**
 * Propriétés d'un webserver
 */
export async function get(req, res) {
  console.log(`Propriétés d'un webserver : ${JSON.stringify(req.params)}`);

  const getWebServerProperties = `/QIBM/ProdData/OS/WebServices/bin/getWebServicesServerProperties.sh -server '${req.params.wserver}' | Rfile -wQ '${FileLibrary}/${FileProperties}'`;

  const connectioniToolkit = new Connection(environnement.CONNEXION_API);

  const command = new CommandCall({
    type: "qsh",
    command: getWebServerProperties,
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
          const sql = `select trim(ldta) as "ldta"
                        from ${FileLibrary}.${FileProperties}
                        where ldta <> ''
                        for read only;`;

          const connectionDB2 = new dbconn(); // Create a connection object.
          connectionDB2.conn("*LOCAL"); // Connect to the database.

          const statement = new dbstmt(connectionDB2); // Create a statement object.

          let resultatSql = statement.execSync(sql);

          statement.close(); // Clean up the statement object.
          connectionDB2.disconn(); // Disconnect from the database.
          connectionDB2.close(); // Clean up the connection object.

          let resultatFinal = { wsrvproperties: {} };

          resultatSql.forEach((element) => {
            if (element.ldta.substring(0, 9).trim() == "Job name:") {
              resultatFinal.wsrvproperties.name = element.ldta.substr(9).trim();
            }
            if (element.ldta.substring(0, 16).trim() == "Runtime user ID:") {
              resultatFinal.wsrvproperties.runtime_user_id = element.ldta
                .substr(16)
                .trim();
            }
            if (element.ldta.substring(0, 14).trim() == "Instance path:") {
              resultatFinal.wsrvproperties.instance_path = element.ldta
                .substr(14)
                .trim();
            }
            if (
              element.ldta.substring(0, 26).trim() ==
              "Web services install path:"
            ) {
              resultatFinal.wsrvproperties.webservices_install_path = element.ldta
                .substr(26)
                .trim();
            }
            if (element.ldta.substring(0, 10).trim() == "Subsystem:") {
              resultatFinal.wsrvproperties.subsystem = element.ldta
                .substr(9)
                .trim();
            }
            if (
              element.ldta.substring(0, 21).trim() == "Server log file name:"
            ) {
              resultatFinal.wsrvproperties.log_file_name = element.ldta
                .substr(21)
                .trim();
            }
            if (element.ldta.substring(0, 17).trim() == "HTTP server name:") {
              resultatFinal.wsrvproperties.http_name = element.ldta
                .substr(17)
                .trim();
            }
            if (element.ldta.substring(0, 18).trim() == "HTTP server ports:") {
              resultatFinal.wsrvproperties.http_ports = element.ldta
                .substr(18)
                .trim();
            }
          });

          res.end(JSON.stringify(resultatFinal));
        });
      }
    });
  } catch {
    res.statusCode = 500;
    res.end(JSON.stringify(result));
  }
}
