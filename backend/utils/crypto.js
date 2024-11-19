const crypto = require("crypto");

// Encrypt data
exports.encrypt = (plainText, key) => {
  const initVector = Buffer.from([
    0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07,
    0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f,
  ]);
  const cipher = crypto.createCipheriv("aes-128-cbc", Buffer.from(key, "hex"), initVector);
  return cipher.update(plainText, "utf8", "hex") + cipher.final("hex");
};

// Decrypt data
exports.decrypt = (encryptedText, key) => {
  const initVector = Buffer.from([
    0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07,
    0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f,
  ]);
  const decipher = crypto.createDecipheriv("aes-128-cbc", Buffer.from(key, "hex"), initVector);
  return decipher.update(encryptedText, "hex", "utf8") + decipher.final("utf8");
};
