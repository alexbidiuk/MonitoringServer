const mongoMethods = require('./mongo/mongoMethods');
const socketMethods = require('./sockets/socketMethods');


const eventsService = (() => {

    const obtainedEventHandler = async (event, object) => {

        let newCreatedEvent = await mongoMethods.eventEntityHandler( event );
        newCreatedEvent && socketMethods.sendEventToPatrol(newCreatedEvent, object);

    };

    return {
        obtainedEventHandler
    }

}) (mongoMethods, socketMethods);

module.exports = eventsService;