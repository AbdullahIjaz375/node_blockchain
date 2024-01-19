const TransactionPool = require('./transaction-pool')
const Transaction = require('./transaction');
const Wallet = require('./index')

describe('Transaction Pool', () => {
    let tp, wallet, transaction;

    beforeEach(() => {
        tp = new TransactionPool();
        wallet = new Wallet();
        transaction = Transaction.newTransaction(wallet, 'r4an-4dr355', 30);
        tp.updateOrAddTransactions(transaction);
    })

    it('adds a transactions to pool', () => {
        expect(tp.transactions.find(t => t.id === transaction.id)).toEqual(transaction);
    })

    it('updates a transaction in the pool', () => {
        const oldTransaction = JSON.stringify(transaction);
        const newTransaction = transaction.update(wallet, 'foo-4dr355', 40);
        tp.updateOrAddTransactions(newTransaction);

        expect(JSON.stringify(tp.transactions.find(t => t.id === newTransaction.id))).not.toEqual(oldTransaction)
    })
})