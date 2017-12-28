//--- Assets -----//

const { SERVER_PORT, SERVER_HOST } = require('./variables/constants');

//---Core Init-----//

const Koa = require('koa');
const cors = require('koa2-cors');
const bodyParser = require('koa-bodyparser');
// const serve = require('koa-static');
const send = require('koa-send');
const logger = require('koa-logger');
const json = require('koa-json');
const { jwtStrat } = require('./middlewares/auth-middleware');

global.__basedir = __dirname;


//---Koa Init-----//

const app = new Koa();
const passport = require('koa-passport');
const router = require('./routes');
const serverConfig = require('./config/server');

app.use(logger());
app.use(bodyParser());
app.use(passport.initialize());
app.use(cors({
    origin: '*'
}));
app.use(json());
app.use(router.routes());
// app.use(jwtStrat);
app.use(async (ctx) => {
    if ('/' == ctx.path) return ctx.body = 'Images by Id';
    await send(ctx, ctx.path, { root: __dirname + '/public' });
});

//---Server Init-----//


const server = module.exports = app.listen(SERVER_PORT, SERVER_HOST);


//---Mongoose init-----//

const mongoConnection = require('./services/mongo/connection');

mongoConnection.init();



//---Socket Init-----//


const socketController = require('./controllers/sockets-controller');
socketController.init();




//---Mocked data-----//

// Object.create({
//     displayName: 'Завод радиотехники на Липковского 1',
//     address: 'улица Василия Липковского 1, третий подъезд',
//     contacts: ['Василий Марков - 050 311 22 33', 'Зигмунд Лазаревич - 088 888 88 88'],
//     info: 'Офис из одной комнаты, код домофона 111',
//     alarms: [{date: '21.09.1992 12:33', text: 'Тревога в зоне с задержкой', zone: 'Охранная зона 1'}],
//     latitude: 50.4363185,
//     longitude: 30.4490714,
//     picks: [{src: '/images/object1.jpg'}, {src: '/images/object2.jpg'}, {src: '/images/object3.jpg'}, {src: '/images/object4.jpg'}]
// });
// Object.create({
//     displayName: 'Магазин ювелирных изделий на Липковского 2',
//     address: 'улица Василия Липковского 2, второй подъезд',
//     contacts: ['Василий Марков - 050 311 22 33', 'Зигмунд Лазаревич - 088 888 88 88'],
//     info: 'Офис из двух комнат, код домофона 222',
//     alarms: [{date: '21.09.1992 12:33', text: 'Тревога в зоне с задержкой', zone: 'Охранная зона 2'}],
//     latitude: 50.4453723,
//     longitude: 30.4399791,
//     picks: [{src: '/images/object1.jpg'}, {src: '/images/object2.jpg'}, {src: '/images/object3.jpg'}, {src: '/images/object4.jpg'}]
// });
// Object.create({
//     displayName: 'Магазин техники на Липковского 3',
//     address: 'улица Василия Липковского 3, первый подъезд',
//     contacts: ['Василий Марков - 050 311 22 33', 'Зигмунд Лазаревич - 088 888 88 88'],
//     info: 'Офис из трех комнат, код домофона 333',
//     alarms: [{date: '21.09.1992 12:33', text: 'Тревога в зоне с задержкой', zone: 'Охранная зона 3'}],
//     latitude: 50.4416311,
//     longitude: 30.4499143,
//     picks: [{src: '/images/object1.jpg'}, {src: '/images/object2.jpg'}, {src: '/images/object3.jpg'}, {src: '/images/object4.jpg'}]
// });



