const socketService = require('./sockets/socket-service');
const eventsDAO = require('./mongo/dao/events-dao');


const eventsService = (() => {


    const obtainedEventHandler = async (event, object) => {

        let newCreatedEvent = await eventEntityHandler( event );
        newCreatedEvent && socketService.sendEventToPatrol(newCreatedEvent, object);

    };


    const eventEntityHandler = async event => {

        try {

            return await eventsDAO.eventEntityCreator(event);
        } catch (err) {

            return false;
        }
        // Object.values(wsUsers).forEach(tmpSocket => {
        //     tmpSocket.volatile.emit('notification', data);
        // });
    };

    const eventStatusUpdater = async (id, status, message) => {
        let event = {
            Id: id,
            status,
            message: message || ''
        };

        try {

            return await eventsDAO.eventFindAndUpdate(event);

        } catch (err) {
            console.log(err);
        }
    };

    return {
        obtainedEventHandler,
        eventStatusUpdater
    }

}) (socketService);

module.exports = eventsService;