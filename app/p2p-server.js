const Websocket = require('ws');

const P2P_PORT = process.env.P2P_PORT || 5001;
const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];
const MESSAGE_TYPES = {
    chain: 'CHAIN',
    transaction: 'TRANSACTION'
}

class P2pServer {
    constructor(blockchain) {
        this.blockchain = blockchain;
        this.sockets = [];
    }

    listen() {
        const server = new Websocket.Server({ port: P2P_PORT });
        server.on('connection', socket => this.connectSocket(socket));

        this.connectToPeers();

        console.log(`Listening on peer-to-peer server connections on: ${P2P_PORT}`)
    }

    connectToPeers() {
        peers.forEach(peer => {
            const socket = new Websocket(peer);

            socket.on('open', () => this.connectSocket(socket))
        })
    }

    connectSocket(socket) {
        this.sockets.push(socket);
        console.log('Socket connected.');

        this.messageHandler(socket);

        this.sendChain(socket)
    }

    messageHandler(socket) {
        socket.on('message', message => {
            const data = JSON.parse(message);
            switch (data.type) {
                case MESSAGE_TYPES.chain:
                    this.blockchain.replaceChain(data.chain);
                    break;
                case MESSAGE_TYPES.transaction:
                    this.transaction.updateOrAddTransaction(data.transaction);
                    break;
            }

            this.blockchain.replaceChain(data);
        });
    }


    sendChain(socket) {
        socket.send(JSON.stringify({ type: MESSAGE_TYPES.chain, chain: this.blockchain.chain }))
    }

    syncChains() {
        this.sockets.forEach(socket => {
            try {
                this.sendChain(socket);
            } catch (error) {
                console.error(`Error sending chain to peer ${socket._socket.remoteAddress}: ${error.message}`);
            }
        });
    }

    sendTransaction(socket, transaction) {
        socket.send(JSON.stringify({ type: MESSAGE_TYPES.transaction, transaction: transaction }));
    }

    broadcastTransaction(transaction) {
        this.sockets.forEach(socket => this.sendTransaction(socket, transaction));
    }

}

module.exports = P2pServer;