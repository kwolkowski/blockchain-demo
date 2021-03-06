const sha256 = require('sha256');

function Blockchain() {
    this.chain = []; // all of the blocks that we create and mine will be store here
    this.pendingTransactions = []; // all of the new transactions that will be created before they are placed into a block

    // generate a genesis block - the very first one
    this.createNewBlock(100, '0', '0');
}

Blockchain.prototype.createNewBlock = function(nonce, previousBlockHash, hash) {
     const newBlock = {
        index: this.chain.length + 1,
        timestamp: Date.now(),
        transactions: this.pendingTransactions,
        nonce: nonce, //proof of work, just a number in this case
        hash: hash,
        previousBlockHash: previousBlockHash
     };

     this.pendingTransactions = []; // The block contains all the previous transactions so we have to empty the new ones
     this.chain.push(newBlock);

     return newBlock
}

Blockchain.prototype.getLastBlock = function() {
    return this.chain[this.chain.length-1];
}

Blockchain.prototype.createNewTransaction = function(amount, sender, recipient) {
    const newTransaction = {
        amount: amount,
        sender: sender,
        recipient: recipient
    };

    this.pendingTransactions.push(newTransaction);

    return this.getLastBlock()['index'] + 1; // we want to return an index of a block that will hold this transaction - it will be the one created after creating this transaction (that's why we have +1)
}

Blockchain.prototype.hashBlock = function(previousBlockHash, currentBlockData, nonce) {
    // return fix-length hash based on passed data - using sha256

    const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);

    return sha256(dataAsString);
}

// The PoW finds a hash that starts with four 0s and returns the nonce of it
Blockchain.prototype.proofOfWork = function(previousBlockHash, currentBlockData) {
    let nonce = 0;
    let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
    while(hash.substring(0, 4) !== '0000') {
        nonce++;
        hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);    
    }
    return nonce;
}

module.exports = Blockchain;