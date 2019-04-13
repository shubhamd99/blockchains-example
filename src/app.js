// Signing transactions - you only spend when you have the private key
const { Blockchain, Transaction } = require('./blockchain');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');


const myKey = ec.keyFromPrivate('6e9f375d114660d1be2c3a6d21572810a38769f843e666d4777c198714d70178');
const myWalletAddress = myKey.getPublic('hex')

let shubhamCoin = new Blockchain();

const tx1 = new Transaction(myWalletAddress, 'public key goes here', 10);
tx1.signTransaction(myKey);
shubhamCoin.addTransaction(tx1);

console.log('\n Starting the minner ...'.green);
shubhamCoin.minePendingTransactions(myWalletAddress);

console.log('\n Balance of shubham is:'.cyan, shubhamCoin.getBalanceOfAddress(myWalletAddress));
