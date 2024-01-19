const Transation = require('./transaction')
const Wallet = require('./index');
const Transaction = require('./transaction');

describe('Transaction', () => {
    let transaction, wallet, recipient, amount;

    beforeEach(() => {
        wallet = new Wallet();
        amount = 50;
        recipient = 'r3c1p13nt';
        transaction = Transation.newTransaction(wallet, recipient, amount);
    })

    it('outputs the `amount` subtracted from the current wallet balance', () => {
        expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount).toEqual(wallet.balance - amount)
    })

    it('outputs the `amount` added to recipient wallet', () => {
        expect(transaction.outputs.find(output => output.address == recipient).amount).toEqual(amount)
    })

    it('inputs the balance of the wallet', () => {
        expect(transaction.input.amount).toEqual(wallet.balance)
    })

    describe('transaction with an amount exceeding the balance', () => {
        beforeEach(() => {
            amount = 5000;
            transaction = Transaction.newTransaction(wallet, recipient, amount)
        })

        it('does not create transaction', () => {
            expect(transaction).toEqual(undefined)
        })
    })

    it('validates a valid transaction', () => {
        expect(Transaction.verifyTransaction(transaction)).toEqual(true)
    })

    it('invalides a corrupt transaction', () => {
        transaction.outputs[0].amount = 5000;
        expect(Transaction.verifyTransaction(transaction)).toEqual(false)
    })

    describe('updating a transaction from same sender', () => {
        let nextAmount, nextRecipient;

        beforeEach(() => {
            nextAmount = 20;
            nextRecipient = 'n3xt-4ddr355';
            transaction = transaction.update(wallet, nextRecipient, nextAmount)
        })

        it('subtracts the next amount from the sender output', () => {
            expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount).toEqual(wallet.balance - amount - nextAmount);
        })

        it('outputs an amount for the next recipient', () => {
            expect(transaction.outputs.find(output => output.address === nextRecipient).amount).toEqual(nextAmount)
        })
    })
})