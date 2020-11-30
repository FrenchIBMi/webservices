/**
 * Fonction permettant de simuler une API de connexion sur l'IBMi avec retour d'un JWT
 */
import QSYGETPH from "./_ibmi";
import rs from "jsrsasign";

const JWS = rs.jws.JWS;

const secret = "MySuperSecretPassPhrase";
const tNow = rs.jws.IntDate.get("now");
const tEnd = rs.jws.IntDate.get("now + 1day");

export async function post(req, res) {
  const { user, password } = req.body;

  try {
    const result = await QSYGETPH(user, password);
    if (result.result === "success") {
      const oHeader = { alg: "HS256", typ: "JWT" };
      let oPayload = {};
      oPayload.iss = "https://cooperl.com";
      oPayload.name = user;
      oPayload.nbf = tNow;
      oPayload.iat = tNow;
      oPayload.exp = tEnd;

      const sHeader = JSON.stringify(oHeader);
      const sPayload = JSON.stringify(oPayload);
      const sJWT = JWS.sign("HS256", sHeader, sPayload, secret);

      req.session.token = sJWT;
      res.end(JSON.stringify({ token: sJWT }));
    } else {
      res.end(
        JSON.stringify({
          error: result.error,
        })
      );
    }
  } catch (error) {
    res.end(
      JSON.stringify({
        error: error,
      })
    );
  }
}
