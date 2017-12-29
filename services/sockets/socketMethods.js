const sqlMethods = require('../sql/sqlMethods');
const mongoMethods = require('../mongo/mongoMethods');
const eventStatus = require('../../variables/mongoVars').eventStatus;
const SOCKET_EVENTS = require('../../variables/socketEvents');

const socketMethods = ((sqlMethods) => {

    const wsUsers = {};

    //--------- Socket Methods --------------//

    const getSocketUsers = () => wsUsers;

    const getSocketUsersLength = () => Object.values( wsUsers ).length;

    const setSocketUser = (socket) => {
        wsUsers[ socket.decoded_token.id ] = socket;
    };

    const delSocketUser = (socket) => {

        delete wsUsers[ socket.decoded_token.id ];
    };

    const emitToUserById = (userId, event, data) => {
        if (wsUsers[userId]) wsUsers[userId].emit(event, data);
        return;
    };

    const sendEventToPatrol = (event, object) => {

        emitToUserById(event.PatrolId, SOCKET_EVENTS.call, {object: object, event: event});
    };

    const rejectEvent = async (socket, id, message) => {
        let event = await mongoMethods.eventEntityUpdaterById(id, eventStatus.rejected, message);
        emitToUserById(event.PatrolId, SOCKET_EVENTS.callRejected, event);


    };

    const acceptEvent = async (socket, id) => {
        let event = await mongoMethods.eventEntityUpdaterById(id, eventStatus.accepted);

        emitToUserById(event.PatrolId, SOCKET_EVENTS.callAccepted, event);

    };

    //--------- Socket Methods End--------------//


return {
    getSocketUsers,
    setSocketUser,
    delSocketUser,
    getSocketUsersLength,
    sendEventToPatrol,
    rejectEvent,
    acceptEvent
}

}) (sqlMethods, mongoMethods);

module.exports = socketMethods;