const sql = require('mssql/msnodesqlv8');
const poolConnection = require('./connection');
const PROCEDURE_NAMES = require('../../variables/sqlProcedures');
const POLLING_INTERVAL = require('../../config/sql').POLLING_INTERVAL ;
const mongoMethods = require('../mongo/mongoMethods');
const socketMethods = require('../sockets/socketMethods');
const eventsService = require('../events-service');
// const EVENTS = require('../../variables/pubSubEvents');

const sqlMethods = (() => {
    let pollingTimer = null,
        pool;


        //--------- Procedure executors --------------//


        const loginProcedureExecutor = async (login, pass) => {
            pool = await poolConnection;
            let request = pool.request();
            let result = await request
                .input('Login', sql.VarChar(sql.MAX), login)
                .input('Password', sql.VarChar(sql.MAX), pass)
                .execute(PROCEDURE_NAMES.login);

            return result.recordset[0];
        };

        const getPatrolsProcedureExecutor = async () => {
             pool = await poolConnection;
            let request = pool.request();
            request.stream = true;
            request.execute(PROCEDURE_NAMES.getPatrols);

            return request;
        };

        const getEventsProcedureExecutor = async () => {
            pool = await poolConnection;
            let request = pool.request();
            request.stream = true;
            request.execute(PROCEDURE_NAMES.getEvents);

            return request;
        };

        const getObjectProcedureExecutor = async (account) => {
             pool = await poolConnection;
            let request = pool.request();
            let result = await request
                .input('Account', sql.NVarChar(sql.MAX), account)
                .execute(PROCEDURE_NAMES.getObject);
            return result.recordset[0];
        };

        const getObjectImagesProcedureExecutor = async (objectId) => {
            pool = await poolConnection;
            let request = pool.request();
            let result = await request
                .input('ObjectId', sql.Int, objectId)
                .execute(PROCEDURE_NAMES.getObjectImages);

            return result.recordset;
        };

        //--------- Procedure executors end--------------//


        //--------- Methods --------------//

        const getPatrols = async () => {

            let req = await getPatrolsProcedureExecutor();
            req.on('row', async patrol => {
                try {
                    await mongoMethods.patrolEntityHandler( patrol );
                } catch (err) {
                    console.log(err);
                }
                // pubSubService.emit(EVENTS.PatrolEntityObtained, patrol);
            });
        };

        const getObject = async account => {
            try {

                let object = await getObjectProcedureExecutor(account);

                let objectPics = await getObjectImagesProcedureExecutor(object.Id);

                let mongoObject = await mongoMethods.objectEntityHandler(object, objectPics);

                return mongoObject;
            } catch (err) {
                console.log(err);
            }
        };

        const getEvents = async () => {

            let req = await getEventsProcedureExecutor();
            req.on('row', async event => {
                try {

                    const object = await getObject( event.Account );

                    eventsService.obtainedEventHandler( event, object );
                } catch (err) {
                    console.log(err);
                }
            });
        };

        const login = async (login, pass) => {
            let loginResult = await loginProcedureExecutor(login, pass);
            return loginResult
        };



        // const getObjectImages = objectId => {
        //     getObjectImagesProcedureExecutor(objectId)
        //         .then((err, images) => {
        //             pubSubService.emit(EVENTS.ObjectImagesObtained, images);
        //          })
        //         .catch(err =>
        //             console.log(err)
        //         )
        // };

        const pollingLoop = () => {

            /// Promise all variant:

                    // Promise.all([getPatrolsProcedure(), getAlarmsInfoProcedure()]).then(values => {
                    //     console.log( values );
                    //     pubSubService.emit(EVENTS.entitiesObtained, values);
                    // }, err => {
                    //     console.log( err );
                    // })

            /// Single listeners:

            getPatrols();
            getEvents();

        };

        const setPollingLoopInterval = () => {
            if(!pollingTimer) pollingTimer = setInterval(pollingLoop, POLLING_INTERVAL);
            return;
        };

        const removePollingLoopInterval = () => {
            if(pollingTimer) {
                clearInterval( pollingTimer );
                pollingTimer = null;
            }
        };

        //--------- Methods end --------------//


        //--------- PubSub --------------//

        // pubSubService.on(EVENTS.startLoopingPoll, setPollingLoopInterval);
        // pubSubService.on(EVENTS.removeLoopingPoll, removePollingLoopInterval);

        //--------- PubSub End--------------//

        return {
            login,
            getObject,
            setPollingLoopInterval,
            removePollingLoopInterval
        }


}) (poolConnection, mongoMethods, socketMethods, sql);

module.exports = sqlMethods;