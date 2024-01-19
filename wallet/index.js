const ChainUtil = require('../chain-util')
const Transaction = require('./transaction')
const { INITIAL_BALANCE } = require('../config')

class Wallet {
    constructor() {
        this.balance = INITIAL_BALANCE;
        this.keypair = ChainUtil.genKeyPair();
        this.publicKey = this.keypair.getPublic().encode('hex');
    }

    toString() {
        return ` Wallet --
        Public Key : ${this.publicKey.toString()}
        Balance    : ${this.balance}`
    }

    sign(dataHash) {
        return this.keypair.sign(dataHash)
    }

    createTransaction(recipient, amount, transactionPool) {
        if (amount > this.balance) {
            console.log(`Amount: ${amount} exceeds the balance.`)
            return
        }

        let transaction = transactionPool.existingTransaction(this.publicKey);

        if (transaction) {
            transaction.update(this, recipient, amount);
        } else {
            transaction = Transaction.newTransaction(this, recipient, amount);
            transactionPool.updateOrAddTransactions(transaction);
        }

        return transaction;
    }
}

module.exports = Wallet;