const socketConnection = require('../services/sockets/connection');
const { JWT_SECRET } = require('../variables/constants');
const SOCKET_EVENTS = require('../variables/socketEvents');

const socketioJwt = require('socketio-jwt');
const sqlMethods = require('../services/sql/sqlMethods');
const socketMethods = require('../services/sockets/socketMethods');

const socketController = ((socketConnection, socketMethods, sqlMethods) => {

    const init = () => {

        const sockets = socketConnection;
        sockets
            .on( 'connection', socketioJwt.authorize( {
                secret: JWT_SECRET,
                timeout: 15000
            } ) )
            .on( 'authenticated', socket => {
                socketMethods.setSocketUser(socket);

                socketMethods.getSocketUsersLength() ? sqlMethods.setPollingLoopInterval() : sqlMethods.removePollingLoopInterval();

                socket.on( SOCKET_EVENTS.acceptCall, id => {
                    socketMethods.acceptEvent(socket, id);
                } );
                socket.on( SOCKET_EVENTS.rejectCall, ({id, message}) => {

                    socketMethods.rejectEvent(socket, id, message);
                } );

                socket.on( 'disconnect', () => {
                    console.log('disconnected socket', socket.decoded_token.id );
                    socketMethods.delSocketUser(socket);
                    !socketMethods.getSocketUsersLength() && sqlMethods.removePollingLoopInterval();
                } );

                socket.on( 'clientEvent', ( res ) => {
                    console.log( res );
                } );

            });
    };

    return {
        init: init
    }

})(socketConnection, socketMethods, sqlMethods);

module.exports = socketController;