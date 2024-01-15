const mongoose = require('mongoose');
const doctorSchema = new mongoose.Schema({
    _id:{
        type: Object,
        required: false,
    },
    Doctor_ID:{
        type: String,
        required: true,
    },
    Password:{
        type: String,
        required: true,
    },
    Specialization:{
        type: String,
        required: true,
    },
    Phone_number:{
        type: String,
        required: true,
    },
    Fees:{
        type: String,
        required: true,
    },
});




module.exports = mongoose.model('Doctor',doctorSchema);
