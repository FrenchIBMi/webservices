# webservices
HTTPGETCLOB : consommation d'un service REST à l'aide de HTTPGETCLOB

HTTPPOSTCLOB : consommation d'un service SOAP à l'aide de HTTPPOSTCLOB

JWTCHK: vérifie un token JWT (voir https://jwt.io/) 
  A/ découpage du header et du payload
  B/ vérification date de validité (émise en temps Unix)
  C/ signature basée sur un certificat (il faut SI70948/7.2,SI70949/7.3,SI70950/7.4)   
  D/ on peut récupérer de la data,  ici $.sub = l'Identifiant (user)
  
Mise en place
ADDLIBLE MYBLIB

CRTRPGMOD MODULE(MYLIB/BASE64UR4) SRCFILE(QJWTSRC) SRCMBR(BASE64UR4)
CRTSRVPGM SRVPGM(MYLIB/BASE64UR4) EXPORT(*ALL)

CRTSQLRPGI OBJ(MYLIB/JWTCHK)  OBJTYPE(*MODULE)  SRCFILE(QJWTSRC) SRCMBR(JWTCHK)
CRTSRVPGM SRVPGM(MYLIB/JWTCHK) EXPORT(*ALL) BNDSRVPGM((AF4TEST/BASE64UR4)        
