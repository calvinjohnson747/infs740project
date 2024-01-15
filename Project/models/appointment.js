const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    _id:{
        type: Object,
        required: false,
    },
    Patient_ID:{
        type: String,
        required: true,
    },
    Doctor_ID:{
        type: String,
        required: true,
    },
    ScheduledDay:{
        type: Date,
        required: true,
    },
});


module.exports = mongoose.model('Appointment',appointmentSchema);
