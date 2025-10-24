export async function generateECDSAKeysBase64() {
  const keyPair = await crypto.subtle.generateKey(
    {
      name: "ECDSA",
      namedCurve: "P-256",
    },
    true,
    ["sign", "verify"],
  );

  const jwkprivatekey = await crypto.subtle.exportKey(
    "jwk",
    keyPair.privateKey,
  );
  const jwkpublickey = await crypto.subtle.exportKey("jwk", keyPair.publicKey);

  const b64privatekey = btoa(JSON.stringify(jwkprivatekey));
  const b64publickey = btoa(JSON.stringify(jwkpublickey));
  return { b64privatekey, b64publickey };
}
