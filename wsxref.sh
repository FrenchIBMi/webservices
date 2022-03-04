#
# Extraire les références croisées web service <-> programme/programme de service
#

# Paramètres : bibliothèque de création du fichier 

export PATH=$PATH:/QIBM/ProdData/OS/WebServices/bin

# créer le fichier BD pour stocker les liens
db2 "create or replace table $1.wsxref (server varchar(10), service varchar(128), program varchar(128)) on replace delete rows"

# Lister les serveurs sans tenir compte de l'état (started/stopped)
servers=$(listWebServicesServers.sh | sed 's/(.*//' )
# Pour chaque serveur listé
for server in $servers ; do
  # Retourver les services sans tenir compte de l'état
  services=$(listWebServices.sh -server $server | sed 's/(.*//')
  # Pour chaque service
  for service in $services ; do
#   # Retrouver les propriétés. Ne garder que l'implémentation
	program=$(getWebServiceProperties.sh -server $server -service $service | grep -i 'Program object path:' | sed 's/Program object path://')
	echo $server $service $program
    db2 "insert into $1.wsxref values('$server', '$service', trim('$program'))"
  done
done
