const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const key = ec.genKeyPair('hex');
const publicKey = key.getPublic('hex');
const privateKey = key.getPrivate('hex');

console.log('Private key: '.cyan, privateKey);
console.log('Public key: '.cyan, publicKey);