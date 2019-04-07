const SHA256 = require('crypto-js/sha256');

/**
 * @property {string} hash
 * @property {string} previousHash
 */
class SimpleBlock {
	constructor(index, timestamp, data, previousHash = '') {
		this.index = index;
		this.timestamp = timestamp;
		this.data = data;
		this.previousHash = previousHash;
	}

	calculateHash() {
		return SHA256(this.index + '' + this.timestamp + '' + JSON.stringify(this.data) + '' + this.previousHash).toString();
	}
}

// console.log(new SimpleBlock(0, Date.now(), {}).calculateHash());

class BlockChain {
	constructor() {
		this.chain = [this.createGenesisBlock()]
	}

	createGenesisBlock() {
		return new SimpleBlock(0, Date.now(), 'Genesis Block', '0');
	}

	/**
	 * @returns {SimpleBlock}
	 */
	getLatestBlock() {
		return this.chain[this.chain.length - 1];
	}

	/**
	 * Adds new block to existing chain.
	 * @param {SimpleBlock} newBlock 
	 */
	addBlock(newBlock) {
		newBlock.previousHash = this.getLatestBlock().hash;
		newBlock.hash = newBlock.calculateHash();
		this.chain.push(newBlock);
	}

	isChainValid() {
		for(let i=1; i<this.chain.length; i++) {
			const currentBlock = this.chain[i];
			const previousBlock =this.chain[i - 1];
			if (currentBlock.hash !== currentBlock.calculateHash()) {
				return false;
			}
			if (currentBlock.previousHash !== previousBlock.hash) {
				return false;
			}
		}

		return true;
	}
}

