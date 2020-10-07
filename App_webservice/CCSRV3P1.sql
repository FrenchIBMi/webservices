--  Générer SQL 
--  Version :                   	V7R3M0 160422 
--  Générée le :              	02/10/20 08:59:03 
--  Base données relation :    	DEVCIL 
--  Option normes :          	Db2 for i 
CREATE OR REPLACE TABLE CCO/CCSRV3P1 ( 
	LDTA CHAR(200) CCSID 297 NOT NULL DEFAULT '' )   
	  
	RCDFMT CCSRV3P1   ; 
  
LABEL ON TABLE CCO/CCSRV3P1 
	IS 'Properties of a WebService' ; 
  
LABEL ON COLUMN CCO/CCSRV3P1 
( LDTA TEXT IS 'Libellé data' ) ; 
  
GRANT DELETE , INSERT , SELECT , UPDATE   
ON CCO/CCSRV3P1 TO PUBLIC ; 
  
GRANT ALTER , DELETE , INDEX , INSERT , REFERENCES , SELECT , UPDATE   
ON CCO/CCSRV3P1 TO QPGMR WITH GRANT OPTION ; 
  
