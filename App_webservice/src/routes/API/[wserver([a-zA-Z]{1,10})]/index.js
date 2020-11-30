const { Connection, CommandCall } = require("itoolkit");
const { dbstmt, dbconn } = require("idb-connector");
const parseString = require("xml2js").parseString;

import * as environnement from "../../../stores/environnement.js";
import fs from 'fs';

const FileLibrary = environnement.FILE_LIBRARY;
const FileServices = environnement.FILE_SERVICES;

export async function get(req, res) {
  console.log(`Liste des webservices du serveur : ${JSON.stringify(req.params)}`);

  const listWebServices = `/QIBM/ProdData/OS/WebServices/bin/listWebServices.sh -server '${req.params.wserver}' | Rfile -wQ '${FileLibrary}/${FileServices}'`;
  const connectioniToolkit = new Connection(environnement.CONNEXION_API);

  const command = new CommandCall({
    type: "qsh",
    command: listWebServices,
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
          // Liste des webservices avec la description
          const sql = `with temp as (select 
              trim(substr(ldta, 1, LOCATE('(', ldta)-1)) as "webservice"
              , trim(substr(ldta, LOCATE('(', ldta)+1, LOCATE(')', ldta) - LOCATE('(', ldta)-1)) as "status_svc"
              from ${FileLibrary}.${FileServices}
              where ldta <> '')
              select "webservice", "status_svc"
              , (select trim(description)  as "description_svc" from XMLTABLE('/service' passing xmlparse(
                      document get_xml_file('/www/${req.params.wserver}/webservices/services/' concat trim("webservice") concat '/META-INF/services.xml'))
                      columns description char(250) path 'description') as x)
              from temp`;

          const connectionDB2 = new dbconn(); // Create a connection object.
          connectionDB2.conn("*LOCAL"); // Connect to the database.

          const statement = new dbstmt(connectionDB2); // Create a statement object.

          /* Resultat global */
          let resultatSql = statement.execSync(sql);

          statement.close(); // Clean up the statement object.
          connectionDB2.disconn(); // Disconnect from the database.
          connectionDB2.close(); // Clean up the connection object.

          // Pour chaque ligne de résultat, on va lire sont fichier de config afin de récupérer des informations supplémentaires
          resultatSql.forEach((element) => {
            try {
              // Lecture du fichier
              const data = fs.readFileSync(
                `/www/${req.params.wserver}/webservices/services/${element.webservice}/WEB-INF/classes/${element.webservice}.config`,
                "UTF-8"
              );

              // découpage des lignes
              const lines = data.split(/\r?\n/);

              let startup_type;
              let runtime_user_id;
              let program_object_path;
              let library_list;

              // pour chaque ligne
              lines.forEach((line) => {
                // Récupération des informations souhaitées
                if (line.substring(0, 11) == "WDT_USERID=") {
                  runtime_user_id = line.substr(11);
                }
                if (line.substring(0, 18) == "WDT_PGMOBJECTPATH=") {
                  program_object_path = line.substr(18);
                }
                if (line.substring(0, 18) == "WDT_RUNTIMELIBIFS=") {
                  library_list = line.substr(18);
                }
                element.properties_svc = {
                  startup_type,
                  runtime_user_id,
                  program_object_path,
                  library_list,
                };
              });
            } catch (err) {
              console.error(err);
            }
          });

          resultatSql = { webservices: resultatSql };
          res.end(JSON.stringify(resultatSql));
        });
      }
    });
  } catch {
    res.statusCode = 500;
    res.end(JSON.stringify(result));
  }
}
