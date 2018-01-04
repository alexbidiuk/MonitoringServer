const Event = require('../../../models/event');


const eventsDAO = (() => {

    const eventEntityCreator = async event => {

        return await Event.create({...event, _id: event.Id});
    };


    const eventFindAndUpdate = async event => {

        return  await Event.findOneAndUpdate(
            { _id: event.Id },
            {
                $set: {
                    ...event
                }
            },
            { new: true }
        );
    };

    return {
        eventFindAndUpdate,
        eventEntityCreator
    }

}) ();

module.exports = eventsDAO;