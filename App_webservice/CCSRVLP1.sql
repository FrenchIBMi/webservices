--  Générer SQL 
--  Version :                   	V7R3M0 160422 
--  Générée le :              	02/10/20 08:59:18 
--  Base données relation :    	DEVCIL 
--  Option normes :          	Db2 for i 
CREATE OR REPLACE TABLE CCO/CCSRVLP1 ( 
	LDTA CHAR(200) CCSID 297 NOT NULL DEFAULT '' )   
	  
	RCDFMT CCSRVLP1   ; 
  
LABEL ON TABLE CCO/CCSRVLP1 
	IS 'Log WebServices' ; 
  
LABEL ON COLUMN CCO/CCSRVLP1 
( LDTA TEXT IS 'Libellé data' ) ; 
  
GRANT DELETE , INSERT , SELECT , UPDATE   
ON CCO/CCSRVLP1 TO PUBLIC ; 
  
GRANT ALTER , DELETE , INDEX , INSERT , REFERENCES , SELECT , UPDATE   
ON CCO/CCSRVLP1 TO QPGMR WITH GRANT OPTION ; 
  
