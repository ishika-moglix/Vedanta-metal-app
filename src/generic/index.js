// const CryptoJS = require("crypto-js");

// let AesUtil = function (keySize, iterationCount) {
//   this.keySize = keySize / 32;
//   this.iterationCount = iterationCount;
// };

// AesUtil.prototype.generateKey = function (salt, passPhrase) {
//   let key = CryptoJS.PBKDF2(passPhrase, CryptoJS.enc.Hex.parse(salt), {
//     keySize: 128 / 32,
//     iterations: this.iterationCount,
//   });
//   return key;
// };

// AesUtil.prototype.encrypt = function (salt, iv, passPhrase, plainText) {
//   let key = this.generateKey(salt, passPhrase);
//   let encrypted = CryptoJS.AES.encrypt(plainText, key, {
//     iv: CryptoJS.enc.Hex.parse(iv),
//   });
//   return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
// };

// AesUtil.prototype.decrypt = function (salt, iv, passPhrase, cipherTexts) {
//   console.log("yes", cipherTexts);

//   let key = this.generateKey(salt, passPhrase);
//   console.log("Generated Key:", key.toString(CryptoJS.enc.Base64)); 

//   // Ensure ciphertext is correctly parsed from Base64
//   let cipherParams = CryptoJS.lib.CipherParams.create({
//     ciphertext: CryptoJS.enc.Base64.parse(cipherTexts),
//   });
//   console.log("Cipher Params:", cipherParams); // Log cipherParams to verify if it's correctly parsed

//   // Perform decryption
//   let decrypted = CryptoJS.AES.decrypt(cipherParams, key, {
//     iv: CryptoJS.enc.Hex.parse(iv),
//   });
  
//   // Check if the decryption was successful by logging intermediate results
//   let decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
//   console.log("Decrypted Text (UTF-8):", decryptedText); // This will show the decrypted text
  
//   // Return decrypted text
//   return decryptedText;
// };


// // AesUtil.prototype.decrypt = function (salt, iv, passPhrase, cipherText) {
// //   let key = this.generateKey(salt, passPhrase);
// //   let cipherParams = CryptoJS.lib.CipherParams.create({
// //     ciphertext: CryptoJS.enc.Base64.parse(cipherText),
// //   });
// //   let decrypted = CryptoJS.AES.decrypt(cipherParams, key, {
// //     iv: CryptoJS.enc.Hex.parse(iv),
// //   });
// // console.log("yes", decrypted.toString(CryptoJS.enc.Utf8));

// //   //console.log("key", key, "cipherText", cipherText, "cipherparams", cipherParams, "decrypted", decrypted, "decrypted.toString(CryptoJS.enc.Utf8)", decrypted.toString(CryptoJS.enc.Utf8))
// //   return decrypted.toString(CryptoJS.enc.Utf8);
// // };

// let aesUtil = new AesUtil(128, 1000);

// const test_on = '000000f7000000bd00000017000000d3';
// const data_on = '0000006c00000001000000720000003c';

// const passPhrase = '1234567891234567';
// const plainText = 'Moglix@123';
// // const cipherText = aesUtil.encrypt(data_on, test_on, passPhrase, plainText);
// //  console.log("Encrypted Text:", cipherText);

// const decodeBase64 = (base64String) => {
//   return atob(base64String); 
// };


// const encodedString =
// "MDAwMDAwNmMwMDAwMDAwMTAwMDAwMDcyMDAwMDAwM2M6OjAwMDAwMGY3MDAwMDAwYmQwMDAwMDAxNzAwMDAwMGQzOjpSc1ZFSjAxcThPQTMxWC80M1ZMd1JnPT0=";
// // 'MDAwMDAwZjcwMDAwMDBiZDAwMDAwMDE3MDAwMDAwZDM6OjAwMDAwMDZjMDAwMDAwMDEwMDAwMDA3MjAwMDAwMDNjOjpteVg1MDloVURLd1FiNnVMRGo1MjhBPT0=';

// const decodedString = decodeBase64(encodedString);
// // const decodedString = Buffer.from(encodedString, "base64").toString("utf-8");
// // console.log("decode", decodedString);

// const [salts, ivs, cipherTexts] = decodedString.split("::");

// // console.log("Salt:", salts);
// // console.log("IV:", ivs);
// // console.log("CipherTexts:", cipherTexts);

// const passPhrases = "1234567891234567";
// try {
// const decryptedText = aesUtil.decrypt(salts,ivs, passPhrases, cipherTexts);
// // const decryptedText = aesUtil.decrypt('000000f7000000bd00000017000000d3', '0000006c00000001000000720000003c', passPhrases, 'myX509hUDKwQb6uLDj528A==');

// console.log("Decrypted Text,,,,:", decryptedText);
// } catch (error) {
// console.error("Error during decryption:", error.message);
// }


// const chars =
// 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
// const Base64 = {
// btoa: input => {
//   let str = input;
//   let output = '';

//   for (
//     let block = 0, charCode, i = 0, map = chars;
//     str.charAt(i | 0) || ((map = '='), i % 1);
//     output += map.charAt(63 & (block >> (8 - (i % 1) * 8)))
//   ) {
//     charCode = str.charCodeAt((i += 3 / 4));

//     if (charCode > 0xff) {
//       throw new Error(
//         "'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.",
//       );
//     }
//     block = (block << 8) | charCode;
//   }
//   return output;
// },
// };

// // let txt = data_on + '::' + test_on + '::' + cipherText;

 


// const CryptoJS = require("crypto-js");

// let AesUtil = function (keySize, iterationCount) {
//   this.keySize = keySize / 32;
//   this.iterationCount = iterationCount;
// };

// AesUtil.prototype.generateKey = function (salt, passPhrase) {
//   // console.log("hit1");
  
//   let key = CryptoJS.PBKDF2(passPhrase, CryptoJS.enc.Hex.parse(salt), {
//     keySize: 128 / 32,
//     iterations: this.iterationCount,
//   });
//   return key;
// };

// AesUtil.prototype.encrypt = function (salt, iv, passPhrase, plainText) {
//   // console.log("hit2");
//   let key = this.generateKey(salt, passPhrase);
//   let encrypted = CryptoJS.AES.encrypt(plainText, key, {
//     iv: CryptoJS.enc.Hex.parse(iv),
//   });
//   return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
// };

// AesUtil.prototype.decrypt = function (salt, iv, passPhrase, cipherText) {
//   let key = this.generateKey(salt, passPhrase);
//   let cipherParams = CryptoJS.lib.CipherParams.create({
//     ciphertext: CryptoJS.enc.Base64.parse(cipherText),
//   });
//   let decrypted = CryptoJS.AES.decrypt(cipherParams, key, {
//     iv: CryptoJS.enc.Hex.parse(iv),
//   });
//   return decrypted.toString(CryptoJS.enc.Utf8);
// };

// let aesUtil = new AesUtil(128, 1000);

// //Generated iv and salt
// let iv = CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex);
// let salt = CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex);


// console.log("yes");

// //encrypt
// console.log(
//   aesUtil.encrypt(
//   salt,
//   iv,
//   '1234567891234567',
//   'Moglix@123'
//   )
// );

// //decrypt
// console.log(
//   aesUtil.decrypt(
//     salt,
//     iv,
//     '1234567891234567',
//     'MDAwMDAwZjcwMDAwMDBiZDAwMDAwMDE3MDAwMDAwZDM6OjAwMDAwMDZjMDAwMDAwMDEwMDAwMDA3MjAwMDAwMDNjOjpteVg1MDloVURLd1FiNnVMRGo1MjhBPT0'
//   )
// );

// export default AesUtil;

const CryptoJS = require('crypto-js');

let AesUtil = function (keySize, iterationCount) {
  this.keySize = keySize / 32;
  this.iterationCount = iterationCount;
};

AesUtil.prototype.generateKey = function (salt, passPhrase) {
  let key = CryptoJS.PBKDF2(passPhrase, CryptoJS.enc.Hex.parse(salt), {
    keySize: 128 / 32,
    iterations: this.iterationCount,
  });
  return key;
};

AesUtil.prototype.encrypt = function (salt, iv, passPhrase, plainText) {
  let key = this.generateKey(salt, passPhrase);
  let encrypted = CryptoJS.AES.encrypt(plainText, key, {
    iv: CryptoJS.enc.Hex.parse(iv),
  });
  return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
};

AesUtil.prototype.decrypt = function (salt, iv, passPhrase, cipherText) {
  let key = this.generateKey(salt, passPhrase);
  let cipherParams = CryptoJS.lib.CipherParams.create({
    ciphertext: CryptoJS.enc.Base64.parse(cipherText),
  });
  let decrypted = CryptoJS.AES.decrypt(cipherParams, key, {
    iv: CryptoJS.enc.Hex.parse(iv),
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
};
// let aesUtil = new AesUtil(128, 1000);
// const salt = "000000f700000bd0000017000000d3";
// const iv = "0000006c00000010000000720000003c"; 
// const passPhrase = "1234567891234567"; 
// const cipherText = "MDAwMDAwZjcwMDAwMDBiZDAwMDAwMDE3MDAwMDAwZDM6OjAwMDAwMDZjMDAwMDAwMDEwMDAwMDA3MjAwMDAwMDNjOjpteVg1MDloVURLd1FiNnVMRGo1MjhBPT0";

// try {
//   const decryptedText = aesUtil.decrypt(salt, iv, passPhrase, cipherText);
//   console.log("Decrypted Text:", decryptedText);
// } catch (error) {
//   console.error("Error during decryption:", error.message);
// }

export default AesUtil;

