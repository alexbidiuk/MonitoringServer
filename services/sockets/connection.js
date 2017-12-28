const server = require('../../index');
const socketIO = require('socket.io');

const socketConnection = (() => {

    return socketIO( server, { pingTimeout: 30000 } );
}) ();

module.exports = socketConnection;