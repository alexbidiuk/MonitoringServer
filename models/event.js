const mongoose = require('mongoose');
const eventStatus = require('../variables/mongoVars').eventStatus;


const eventSchema = new mongoose.Schema({
    _id: { type: Number, required: true, unique: 'Такое событие уже существует'},
    ReceivedDate: String,
    PatrolId: Number,
    Patrol: String,
    Account: String,
    Status: {type: String, default: eventStatus.pending},
    Message: String
}, {
    timestamps: true
});

eventSchema.index({createdAt: 1},{expireAfterSeconds: 30});

module.exports = mongoose.model('Event', eventSchema);