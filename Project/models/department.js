const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
    _id:{
        type: Object,
        required: false,
    },
    Index:{
        type: String,
        required: true,
    },
    Doctor_ID:{
        type: String,
        required: true,
    },
    Specialization:{
        type: Date,
        required: true,
    },
});


module.exports = mongoose.model('Department',departmentSchema);
