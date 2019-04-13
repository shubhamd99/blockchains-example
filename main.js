// Blockchain example

const SHA256 = require('crypto-js/sha256');
const colors = require('colors');

class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    // Proof of work Algorithm (We can control how fast new block can be added to our block chain)
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
        this.difficulty = 4;
    }

    // First block is called genesis, because it can not point to the previous block
    createGenisBlock() {
        return new Block(0, "04/04/1997", "Shubham Dhage", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
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
shubhamCoin.addBlock(new Block(1, "10/07/2019", { amount: 4 }));
shubhamCoin.addBlock(new Block(2, "12/08/2019", { amount: 10 }))

console.log('Is blockchain valid? '.yellow + shubhamCoin.isChainValid()); // true

// Tempering
shubhamCoin.chain[1].data = { amount: 100 };
console.log('Is blockchain valid? '.yellow + shubhamCoin.isChainValid()); // false

console.log(JSON.stringify(shubhamCoin, null, 4));
