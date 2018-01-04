const passport = require('koa-passport');
const LocalStrategy = require('passport-local'); //локальная стратегия авторизации
const JwtStrategy = require('passport-jwt').Strategy; // авторизация через JWT
const ExtractJwt = require('passport-jwt').ExtractJwt; // авторизация через JWT

const sqlMethods = require('../services/sql/sql-service');

const { JWT_SECRET } = require('../variables/constants');

const ROLES = require('../variables/roles');

const User = require('../models/user');

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('JWT'),
    secretOrKey: JWT_SECRET
};

passport.use( new LocalStrategy( {
            usernameField: 'caption',
            passwordField: 'password',
            session: false
        }, async function ( caption, password, done ) {

            try {
                await User.findOne( { Caption: caption }, ( err, user ) => {

                    if (err) {
                        return done( err );
                    }

                    if (!user || !user.checkPassword( password )) {
                        return done( null, false, { message: 'Нет такого пользователя или пароль неверен.' } );
                    }
                    return done( null, user );
                } );
            } catch (err) {
                console.log(err)
            }
        } ));



passport.use(new JwtStrategy(jwtOptions, async function (payload, done) {

    try {
        await User.findOne({ _id: payload.id }, (err, user) => {

            if (err) {
                return done(err, false)
            }
            if (!user) {
                return done( null, false, { message: 'Нет такого пользователя.' } );
            }

            return done( null, user );
        })
    } catch (err) {
        console.log(err)
    }
}));


const jwtStrat = async (ctx, next) => {

    await passport.authenticate( 'jwt', ( err, user, info ) => {
        if (!user) {
            ctx.status = 401;
            ctx.body = info.message;
        } else {
            ctx.user = user;
            return next();
        }
    })(ctx, next);
};


const localStrat = async (ctx, next) => {

    await passport.authenticate('local', (err, user, info) => {
        if (user) {
            ctx.user = user;
        } else {
            ctx.errMessage = info.message;
        }
        return next();
    })(ctx, next);
};

const sqlDbLogin = async (ctx, next) => {
    const { caption, password } = ctx.request.body;
    if (!ctx.user) {
        try {
            let sqlUser = await sqlMethods.login(caption, password);
            if(sqlUser) {
                ctx.user = {_id: sqlUser.Id, Caption: sqlUser.Login, Role: ROLES.operator };
                ctx.errMessage = null;
            }
        } catch(err) {
           console.log(err);
        }
    }
    return next();
};

const roleCheck = role => (ctx, next) => {

    if(ctx.user && role !== ctx.user.Role) {
        ctx.user = null;
        ctx.status = 403;
        ctx.body = 'Запрещено.';
    } else {
        return next();
    }
};

module.exports = {
    sqlDbLogin,
    jwtStrat,
    localStrat,
    roleCheck
};