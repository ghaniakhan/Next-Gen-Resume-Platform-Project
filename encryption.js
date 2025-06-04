// utils/encryption.js
// export async function encryptFile(file) {
//   const key = await crypto.subtle.generateKey(
//     { name: "AES-GCM", length: 256 },
//     true,
//     ["encrypt"]
//   );

//   const iv = crypto.getRandomValues(new Uint8Array(12));
//   const fileBuffer = await file.arrayBuffer();

//   const encryptedContent = await crypto.subtle.encrypt(
//     { name: "AES-GCM", iv },
//     key,
//     fileBuffer
//   );

//   const exportedKey = await crypto.subtle.exportKey("raw", key);

//   return {
//     encryptedFile: new Blob([encryptedContent]),
//     key: exportedKey,
//     iv,
//   };
// }
