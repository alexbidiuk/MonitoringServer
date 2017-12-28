const mongoose = require('mongoose');

const mongoConnection = (() => {

    const init = () => {
        mongoose.Promise = Promise;
        mongoose.set('debug', false)
            .connect('mongodb://localhost/test')
            .connection.on('error', console.error);
        return mongoose;
    };

    return {
        init
    }

}) (mongoose);

module.exports = mongoConnection;