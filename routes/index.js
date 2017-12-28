const Router = require('koa-router');
const jwt = require('jsonwebtoken');
const passport = require('koa-passport');
const router = new Router();
const { sqlDbLogin, jwtStrat, localStrat, roleCheck } = require('../middlewares/auth-middleware');
const { JWT_SECRET } = require('../variables/constants');
const ROLES = require('../variables/roles');
const User = require('../models/user');
const Event = require('../models/event');
const Object = require('../models/object');



//маршрут для создания нового патруля

// User.create({
//     Caption: 'operator',
//     Password: '1111',
//     Role: ROLES.operator
//
// });
// router.post('/', async ctx => {
//     try {
//         let user = await User.create(ctx.request.body);
//         ctx.body = user;
//     }
//     catch (err) {
//         ctx.status = 400;
//         ctx.body = err;
//     }
// });



//маршрут для локальной авторизации и создания JWT при успешной авторизации

router.post('/login', localStrat, sqlDbLogin, roleCheck(ROLES.operator), async ctx => {

        if(ctx.user) {
            const payload = {
                id: ctx.user._id,
                Caption: ctx.user.Caption || '',
                Role: ctx.user.Role || ''
            };

            const token = jwt.sign( payload, JWT_SECRET );

            ctx.body = { user: ctx.user.Caption, token: 'JWT ' + token };
        } else {

            ctx.status = 401;
            ctx.body = ctx.errMessage;
        }
});


router.get('/delete', async (ctx, next) => {
    Event.collection.drop();
    User.collection.drop();
    Object.collection.drop();
});

router.get('/objects', async ctx => {


        await Object.find( {}, ( err, objects ) => {
            let objectMap = {};
            objects.forEach( object => {
                objectMap[ object._id ] = object;
            } );
            ctx.body = objectMap;
        });

});


//
router.get('/patrols', async ctx => {

    try {

        let patrols = await User.find(
            {Role: ROLES.patrol},
            {_id: 1, Caption: 1}
        );

        ctx.body = patrols;

    } catch (e) {

        ctx.throw();
    }



    // let patrolMap = {};
    // patrols.forEach(patrol=> {
    //     patrolMap[patrol._id] = patrol;
    // });


});

router.post('/patrol/changePass', async ctx => {

    try{

       await User.updateOne(
           {'_id': ctx.request.body.id},
           {
               $set: {
                   'Password': ctx.request.body.password
               }
           }

       );
       ctx.body = 'Пароль успешно изменен.'

    } catch(err) {
        ctx.throw()
    }

});



router.get('/events', async ctx => {

    await Event.find({}, (err, events) => {
        let eventMap = {};
        events.forEach(event=> {
            eventMap[event._id] = event;
        });
        ctx.body = eventMap;
    });
});

// router.get('/images/:objectId/', async ctx => {
//     await Object.findById(ctx.params.objectId, ( err, object ) => {
//         if (err) ctx.body = 'Такого объекта не существует';
//         let objImgs = object.Pics.map(imgObj => imgObj.data.toString('base64'));
//         ctx.body = objImgs;
//     });
// });

module.exports = router;