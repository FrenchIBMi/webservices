const ServerDoesNotExist = "IWS00240E"; // Erreur - Server does not exist
const ServiceDoesNotExist = "IWS00202E"; // Erreur - WebService does not exist
const CommandSuccessfull = "IWS00102I"; // OK - Commande exécutée avec succès
const PermissionRefused = "IWS00107E"; // Erreur - Droits insuffisants.
const ServiceExist = "IWS00207E"; // Erreur - Web service already exists.
const ParameterValueNotValid = "IWS00103E"; // Erreur - Parameter value not valid.
// Specified object XXXX not found.
const OperationFailed = "IWS00999E"; // Erreur - Operation failed.

exports.checkStatus = function (codeStatus) {
  let statusRetour = {
    codeStatut: "",
    libelleStatut: "",
  };

  switch (codeStatus) {
    case PermissionRefused:
      statusRetour.codeStatut = 403;
      statusRetour.libelleStatut = PermissionRefused;
      break;
    case ServerDoesNotExist:
      statusRetour.codeStatut = 404;
      statusRetour.libelleStatut = ServerDoesNotExist;
      break;
    case ServiceDoesNotExist:
      statusRetour.codeStatut = 404;
      statusRetour.libelleStatut = ServiceDoesNotExist;
      break;
    case CommandSuccessfull:
      statusRetour.codeStatut = 204;
      statusRetour.libelleStatut = CommandSuccessfull;
      break;
    default:
      statusRetour.codeStatut = 500;
      statusRetour.libelleStatut = "Erreur inconnue";
      break;
  }

  return statusRetour;
};
