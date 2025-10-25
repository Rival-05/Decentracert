// cryptoutils.js

export async function signCertificate(details, privateKeyJwk) {
  const encoder = new TextEncoder();
  const message = JSON.stringify(details);
  const data = encoder.encode(message);

  // Import the private key from JWK format
  const cryptoKey = await crypto.subtle.importKey(
    "jwk",
    privateKeyJwk, // This is your decoded JWK object
    { name: "ECDSA", namedCurve: "P-256" },
    false,
    ["sign"],
  );

  // Sign the data using ECDSA with SHA-256
  const signature = await crypto.subtle.sign(
    {
      name: "ECDSA",
      hash: { name: "SHA-256" },
    },
    cryptoKey,
    data,
  );

  // Convert signature ArrayBuffer to hex string
  const signatureHex = Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return signatureHex;
}

export async function verifyCertificate(details, signatureHex, publicKeyJwk) {
  const encoder = new TextEncoder();
  const message = JSON.stringify(details);
  const data = encoder.encode(message);

  // Import the public key from JWK format
  const cryptoKey = await crypto.subtle.importKey(
    "jwk",
    publicKeyJwk,
    { name: "ECDSA", namedCurve: "P-256" },
    false,
    ["verify"],
  );

  // Convert hex signature back to Uint8Array
  const signatureBytes = new Uint8Array(
    signatureHex.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)),
  );

  // Verify the signature
  const isValid = await crypto.subtle.verify(
    {
      name: "ECDSA",
      hash: { name: "SHA-256" },
    },
    cryptoKey,
    signatureBytes,
    data,
  );

  return isValid;
}
