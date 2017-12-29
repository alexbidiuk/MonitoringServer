const mkdirp = require('mkdirp-promise');
const fs = require('fs');

const richTextParser = require('../thirdPart/richTextParser');
const serverConfig = require('../../config/server');

const mongoMethods = (() => {

    const User = require( '../../models/user' );
    const Event = require('../../models/event');
    const SecObject = require( '../../models/object' );


    //--------- Mongo methods -------//

    const patrolEntityHandler = async patrol => {

        try {
            // console.log(patrol);
            await User.findOneAndUpdate(
                { _id: patrol.Id },
                { $set: { ...patrol } },
                {
                    upsert: true,
                    setDefaultsOnInsert: true
                }
            );
        } catch (err) {
            console.log(err);
        }

        // Object.values(wsUsers).forEach(tmpSocket => {
        //     tmpSocket.volatile.emit('notification', data);
        // });
    };

    const eventEntityHandler = async event => {

        try {
            let newEv = await Event.create({...event, _id: event.Id});
            return newEv;
        } catch (err) {
           return false;
        }
        // Object.values(wsUsers).forEach(tmpSocket => {
        //     tmpSocket.volatile.emit('notification', data);
        // });
    };

    const eventEntityUpdaterById = async (id, status, message) => {
        try {

            return await Event.findOneAndUpdate(
                { _id: id },
                {
                    $set: {
                        Status: status,
                        Message: message || ''
                    }
                },
                { new: true }
                );
        } catch (err) {
            console.log(err);
        }
    };

    const objectEntityHandler = async (object, objectPics) => {

        try {
            let objDir = `${global.__basedir}\\${serverConfig.publicFolderPath}\\${object.Id}`;

            let objImgs=[];

            await mkdirp(objDir);


            objectPics.forEach( ( pic, i ) => {

                objImgs.push( `${object.Id}/${object.Id}_${i}.jpg` );

                fs.writeFile( `${objDir}\\${object.Id}_${i}.jpg`, pic.data, err => {
                    if (err) console.log('writeFile error', err );
                });
            });




            let finalObj = { ...object };
            finalObj.Description = richTextParser.rtf2text(object.Description);
            finalObj.Pics = objImgs;


            return await SecObject.findOneAndUpdate(
                { _id: object.Id },
                { $set: { ...finalObj } },
                {
                    upsert: true,
                    new: true,
                    returnNewDocument: true,
                    setDefaultsOnInsert: true
                }
            );

        } catch (err) {
            console.log(err);
        }
        // Object.values(wsUsers).forEach(tmpSocket => {
        //     tmpSocket.volatile.emit('notification', data);
        // });
    };

    // const objectImagesHandler = async images => {
    //
    //     await SecObject.findOneAndUpdate(
    //         { _id: object.Id },
    //         { $set: { pics: images } },
    //         { upsert: true }
    //     );
    //     // Object.values(wsUsers).forEach(tmpSocket => {
    //     //     tmpSocket.volatile.emit('notification', data);
    //     // });
    // };

    //--------- Mongo methods end-------//



    //--------- PubSub --------------//

    // pubSubService.on(EVENTS.PatrolEntityObtained, patrolEntityHandler);
    // pubSubService.on(EVENTS.EventEntityObtained, eventEntityHandler);
    // pubSubService.on(EVENTS.ObjectEntityObtained, objectEntityHandler);
    // pubSubService.on(EVENTS.ObjectImagesObtained, objectImagesHandler);

    //--------- PubSub End--------------//


    return {
        patrolEntityHandler,
        eventEntityHandler,
        objectEntityHandler,
        eventEntityUpdaterById
    }

}) ();

module.exports = mongoMethods;