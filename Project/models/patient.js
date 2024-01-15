const mongoose = require('mongoose');
const patientSchema = new mongoose.Schema({
    _id:{
        type: Object,
        required: false,
    },
    Patient_ID:{
        type: String,
        required: true,
    },
    Password:{
        type: String,
        required: true,
    },
    Age:{
        type: Number,
        required: true,
    },
    Gender:{
        type: Number,
        required: true,
    },
    diabetes:{
        type: Number,
        required: true,
    },
    copd:{
        type: Number,
        required: true,
    },
    asthma:{
        type: Number,
        required: true,
    },
});

module.exports = mongoose.model('Patient',patientSchema);