// Blockchain's transaction example - Crypto currency

const SHA256 = require('crypto-js/sha256');
const colors = require('colors');

class Transaction {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

class Block {
    constructor(timestamp, transactions, previousHash = '') {
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    mineBlock(difficulty) {
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("Block mined: " + this.hash);
    }
}

class Blockchain {
    constructor(){
        this.chain = [this.createGenisBlock()];
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }
 
    createGenisBlock() {
        return new Block("04/04/1997", "Shubham Dhage", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    minePendingTransactions(miningRewardAddress) {
        let block = new Block(Date.now(), this.pendingTransactions);
        block.mineBlock(this.difficulty);

        console.log("Block succesfully mined! ".yellow);
        this.chain.push(block);

        /* Resseting the pending transactions array and create a new 
            transaction to give the minner his reward */
        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];
    }

    createTransaction(transaction) {
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address) {
        let balance = 0;

        for(const block of this.chain) {
            for(const trans of block.transactions) {
                if(trans.fromAddress === address) {
                    balance -= trans.amount;
                }

                if(trans.toAddress === address) {
                    balance += trans.amount;
                }
            }
        }

        return balance;
    }

    isChainValid() {
        for(let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }
            
            if(currentBlock.previousHash !== previousBlock.hash){
                return false;
            }
        } 

        return true;
    }
}

let shubhamCoin = new Blockchain();
// address key is the public key of someones wallet
shubhamCoin.createTransaction(new Transaction('address1', 'address2', 100));
shubhamCoin.createTransaction(new Transaction('address2', 'address1', 100));

console.log('\n Starting the minner ...'.green);
shubhamCoin.minePendingTransactions('shubham-address');

console.log('\n Balance of shubham is:'.cyan, shubhamCoin.getBalanceOfAddress('shubham-address'));

console.log('\n Starting the minner ...'.green);
shubhamCoin.minePendingTransactions('shubham-address');

console.log('\n Balance of shubham is:'.cyan, shubhamCoin.getBalanceOfAddress('shubham-address'));