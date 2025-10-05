import crypto from "crypto";

const ALG = "aes-256-cbc";
export const decrypt = async (encryptedData: string, key: string) => {
    
  const textParts = encryptedData.split(":");
  if (!textParts || textParts.length !== 2) {
    throw new Error("Invalid credential format.");
  }
  const iv = Buffer.from(textParts.shift() as string, "hex");
  const encryptedText = Buffer.from(textParts.join(":"), "hex");
  const decipher = crypto.createDecipheriv(ALG, Buffer.from(key, "hex"), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
};
