# Webservices

Liste des webservers et Webservices d'un IBMi.
Fonctionnalités :
- Protection par identifiant/mot de passe IBMi.
- Arrêt / Démarrage d'un webserveur,
- Arrêt / Démarrage d'un webservice,
- Génération du fichier de configuration pour envoi sur un autre système.

## Pré-requis
- SS1 Option 3
- SS1 Option 12
- SS1 Option 30
- SS1 Option 33
- DG1 – IBM HTTP Server for i. 
- JV1 Option 14
- Etre à jour sur les groupes HTTP et JAVA pour profiter des dernières fonctionnalités
- Avoir le produit open-source NodeJS version 10 minimum
- Avoir les droits sur les commandes de sauvegarde/restauration `SAVRST` / `RST` sur les différents systèmes.

## Installation
Exécuter les requêtes de création des tables :
- CCSRVLP1.sql
- CCSRV1P1.sql
- CCSRV2P1.sql
- CCSRV3P1.sql
- Créer un chemin dans l'IFS pour la génération du fichier.

Mettre à jour le fichier `src/stores/environnement.js` en fonction de votre environnement. 


## Production mode and deployment

To start a production version of your app, run `npm run build`. This will disable live reloading, and activate the appropriate bundler plugins.
Define the port number `export PORT=9999`.
Run with `node __sapper__/build`

### Compatibilité PM2
Se positionner dans le répertoire puis 
`pm2 start __sapper__/build/index.js --name "webservice"`

### Principe de fonctionnement
L'application se base sur les scripts disponibles dans `/QIBM/ProdData/OS/WebServices/bin/`. 

|Command | Description|
| ------------- |-------------| 
|createWebServicesServer.sh | Creates an integrated web services server.|
|deleteWebServicesServer.sh | Deletes an integrated web services server.|
|getWebServiceProperties.sh | Gets web service properties.|
|getWebServicesServerProperties.sh | Gets web services server properties.|
|installWebService.sh | Installs a web service.|
|listWebServices.sh | Lists all deployed web services in a web services server.|
|listWebServicesServers.sh | Lists all integrated web services servers.|
|restoreWebServices.sh | Restores web services from a save file.|
|restoreWebServicesServer.sh | Restores web services server from a save file.|
|saveWebServices.sh | Saves web services to a save file.|
|saveWebServicesServer.sh | Saves web services server to a save file.|
|setWebServiceProperties.sh | Sets web service properties.|
|setWebServicesServerProperties.sh | Sets web services server properties.|
|startWebService.sh | Starts a web service that is in a stopped state.|
|startWebServicesServer.sh | Starts an integrated web services server.|
|stopWebService.sh | Stops a web service that is in an active state.|
|stopWebServicesServer.sh | Stops an integrated web services server.|
|uninstallWebService.sh | Uninstalls a web service.|

Ces scripts étants consommateurs de ressources, l'application va chercher quelques informations directement dans les fichiers de configuration des webservices (par défaut dans `/www/wservice/webservices/services`).

Pour déployer le webservice sur une autre machine, un fichier de configuration est généré puis ce fichier est envoyé sur la machine distante via la commande `SAVRST`.

La commande d'installation est généré et doit être exécuté manuellement par l'utilisateur.

## Documentations
[iToolkit](https://nodejs-itoolkit.readthedocs.io/en/latest/index.html)
[idb-connector](https://github.com/IBM/nodejs-idb-connector/blob/master/docs/README.md)
[IBMi scripts webservices](https://public.dhe.ibm.com/systems/support/i/iws/systems_i_software_iws_pdf_WebServicesServer_new.pdf)
