var addressUtilities = require('../utils/address');
var arrayUtilities = require('../utils/array');
var validator = require('../utils/validator');
var chainUtilities = require('../utils/chain');

var blockchain = function blockchain(){

  var self = this;

  this.init = init;
  this.newBlock = newBlock;
  this.newTransaction = newTransaction;
  this.getChain = getChain;
  this.checkChain = checkChain;
  this.mine = mine;

  this.chain;
  this.currentTransactions;

  function init(){
    self.chain = [];
    self.currentTransactions = [];
    self.newBlock(100, 1);
  }

  function getChain(){
    return self.chain;
  }

  function mine(miner){
    var lastBlock = self.chain[self.chain.length-1];
    var transaction = newTransaction(0, miner, 1);
    var proof = validator.generateProof(transaction);
    var previousHash = validator.calculateHash(lastBlock.transaction[0]);
    return newBlock(proof, previousHash);
  }

  function newBlock(proof, previousHash){
    var block = {
      "index": self.chain.length+1,
      "timestamp": new Date().getTime(),
      "transaction": self.currentTransactions,
      "proof": proof,
      "previousHash": previousHash
    };
    self.currentTransactions = [];
    self.chain.push(block);
    return block;
  }

  function newTransaction(sender, receiver, amount){
    var transaction = {
      sender: sender,
      receiver: receiver,
      amount: amount
    };
    self.currentTransactions.push(transaction);
    return transaction;
  }


  function checkChain() {
    let chain = getChain();
    if (!Array.isArray(chain) || chain.length === 0) {
      return [];
    }
    for (let i = 1; i < chain.length; i++) {
      const previousBlock = chain[i - 1];
      const currentBlock = chain[i];
      if (currentBlock.previousHash !== validator.calculateHash(previousBlock)) {
        return [];
      }
      if (!validator.validateProof(previousBlock.proof, currentBlock.proof)) {
        return [];
      }
      if (typeof currentBlock.index === 'undefined' || typeof currentBlock.timestamp === 'undefined' ||
          typeof currentBlock.proof === 'undefined' || typeof currentBlock.previousHash === 'undefined' ||
          !currentBlock.transaction) {
        return [];
      }
      if (currentBlock.index !== previousBlock.index + 1) {
        return [];
      }
    }
    return chain;
  }

  if(blockchain.caller != blockchain.getInstance){
    throw new Error("This object cannot be instanciated");
  }
};

blockchain.instance = null;
blockchain.getInstance = function(){
	if(this.instance === null){
		this.instance = new blockchain();
	}
	return this.instance;
};

module.exports = blockchain.getInstance();
