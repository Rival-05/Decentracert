export async function signCertificate(details, privateKey) {
  const encoder = new TextEncoder();
  const message = JSON.stringify(details);
  const data = encoder.encode(message);

  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashedDetails = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const keyData = encoder.encode(privateKey);
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const signedData = await crypto.subtle.sign(
    "HMAC",
    cryptoKey,
    encoder.encode(hashedDetails),
  );

  const signatureHex = Array.from(new Uint8Array(signedData))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const certificateData = {
    details,
    signature: signatureHex,
    publicKey: formData.publickey,
  };

  return certificateData;
}
