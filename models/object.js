const mongoose = require('mongoose');

const objectSchema = new mongoose.Schema({
    _id: { type: Number, required: true },
    Description: String,
    City: String,
    Region: String,
    Street: String,
    Building: String,
    Appartment: String,
    Floor: String,
    FloorCount: String,
    Entrance: String,
    Alarms: Array,
    Pics: Array
}, {
    timestamps: true
});


module.exports = mongoose.model('Object', objectSchema);