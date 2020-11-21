import * as environnement from "../../stores/environnement.js";

const { Connection, CommandCall, ProgramCall } = require("itoolkit");
const parseString = require("xml2js").parseString;

const FileServers = "CCSRV1P1"; // Nom du fichier des webservers (temporaire)
const FileLibrary = 'CCO';

export async function get(req, res) {
  console.log(req.query);

  const listWebServicesServers = `/QIBM/ProdData/OS/WebServices/bin/listWebServicesServers.sh | Rfile -wQ '${FileLibrary}/${FileServers}'`;
  const connectioniToolkit = new Connection(environnement.CONNEXION_API);

  const command = new CommandCall({
    type: "qsh",
    command: listWebServicesServers,
  });
  console.log("listWebServers : ", listWebServicesServers);

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
          console.log("Error : ", JSON.stringify(result.myscript.qsh[0].error));
          res.end("OK", 200, JSON.stringify(result.myscript));
        });
      }
    });
  } catch {
    res.status(500).json(JSON.stringify(result));
  }
}
