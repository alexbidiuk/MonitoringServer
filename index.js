//--- Assets -----//

const { SERVER_PORT, SERVER_HOST } = require('./variables/constants');

//---Core Init-----//

const Koa = require('koa');
const cors = require('koa2-cors');
const bodyParser = require('koa-bodyparser');
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
    origin: 'http://192.168.17.21:3000'
}));
app.use(json());
app.use(router.routes());
app.use(jwtStrat);
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




