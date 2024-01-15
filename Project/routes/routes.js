const express = require('express');
const router = express.Router();
const path = require('path');
const doctors = require('../models/users');
const Patient = require('../models/patient');
const Department = require('../models/department');
const Appointment = require('../models/appointment');
const bodyParser = require('body-parser');
const appointment = require('../models/appointment');
const {python_shell} = require('python-shell');
const mongoose = require("mongoose");

const app = express();
app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    urlencoded:true
}));

router.get("/",(req,res)=>{
    res.render('index',{title:"Hospital Home Page"});
});

router.post("/doctor",(req,res)=>{
    var id = req.body.username;
    var pass = req.body.password;
    console.log(id+pass);
    doctors.findOne({
        Doctor_ID: id,
        Password: pass,
    })
    .then((results)=>{
        if(results == null){
            res.redirect("/Incorrect");
            console.log(results);
        }
        else{
        res.render("welcome",{
            title:"Doctor Welcome Page",
            doctor: id,
            id: id,
        });}
        }).catch((err)=>{
            res.send("Error has occured");  
    });
});

router.get("/pregister",(req,res)=>{
    res.render('pregister',{title:"Patient Register Page"});
});

router.get("/pupdate",(req,res)=>{
    res.render('pupdate',{title:"Patient Update Page"});
});

router.get("/pdelete",(req,res)=>{
    res.render('pdelete',{title:"Patient Delete Page"});
});

router.post("/pregister",(req,res)=>{
    const patient = new Patient();
        patient._id = new mongoose.Types.ObjectId();
        patient.Patient_ID = req.body.patientid;
        patient.Password = req.body.patientid;
        patient.Age = req.body.age;
        patient.Gender = req.body.gender;
        patient.diabetes = req.body.diabetes;
        patient.copd = req.body.copd;
        patient.asthma = req.body.asthma;
    patient.save((err,patient)=>{
        if(err){
            res.json({message: err.message,type:'danger'});
        }else{
            res.render("patient",{
                title: "Add Appointments Page",
            });
        }
    });
});

router.post("/pupdate",(req,res)=>{
    Patient.findOneAndUpdate({Patient_ID:req.body.patientid},{
        Age: req.body.Age,
        Gender: req.body.Gender,
        diabetes: req.body.diabetes,
        copd: req.body.copd,
        asthma: req.body.asthma,
    },(err,result)=>{
        if(err){
            res.json({message: err.message, type:'danger'});
        }else{
            req.session.message={
                type: 'Success',
                message: "Appointment Updated"
            };
            res.redirect("/"); 
        }
    });
}); 

router.post("/pdelete", (req,res)=>{
    Patient.findOneAndDelete({Patient_ID:req.body.patientid}, (err,result)=>{
        console.log(result);
        if(err){
            res.json({message: err.message});
        }else{
            req.session.message={
                type: "info",
                message: "User deleted successfully"
            };
            res.redirect("/patient");
        }
    });
});

router.get("/dregister",(req,res)=>{
    res.render("dregister",{title:"Doctor Registration Page"});
});

router.post("/dregister",(req,res)=>{
    const doctor = new doctors();
        doctor._id = new mongoose.Types.ObjectId();
        doctor.Doctor_ID = req.body.doctorid;
        doctor.Password = req.body.doctorid;
        doctor.Specialization = req.body.specialization;
        doctor.Phone_number = req.body.phone;
        doctor.Fees = req.body.fees;
    doctor.save((err,doctor)=>{
        if(err){
            res.json({message: err.message,type:'danger'});
        }else{
            res.render("doctor",{
                title: "Add Appointments Page",
            });
        }
    });
});

router.get("/dupdate",(req,res)=>{
    res.render("dupdate",{title:"Doctor Update Page"});
});

router.post("/dupdate",(req,res)=>{
    doctors.findOneAndUpdate({Doctor_ID:req.body.doctorid},{
        Specialization: req.body.specialization,
        Phone_number: req.body.phone,
        Fees: req.body.fees,
    },(err,result)=>{
        if(err){
            res.json({message: err.message, type:'danger'});
        }else{
            req.session.message={
                type: 'Success',
                message: "Appointment Updated"
            };
            res.redirect("/doctor"); 
        }
    });
}); 

router.get("/ddelete",(req,res)=>{
    res.render("ddelete",{title:"Doctor Update Page"});
});

router.post("/ddelete", (req,res)=>{
    doctors.findOneAndDelete({Doctor_ID:req.body.doctorid}, (err,result)=>{
        console.log(result);
        if(err){
            res.json({message: err.message});
        }else{
            req.session.message={
                type: "info",
                message: "User deleted successfully"
            };
            res.redirect("/doctor");
        }
    });
});

router.get("/visual",(req,res)=>{
    res.render("visual",{title:"Visualization Page"});
});

router.get("/Incorrect",(req,res)=>{
    res.render("Incorrect",{title:"Incorrect Page"});
});

router.get("/doctor",(req,res)=>{
    res.render("doctor",{title:"Doctor Page"});
});

router.get("/patient",(req,res)=>{
    res.render("patient",{title:"Patient Page"});
});

router.get("/add",(req,res)=>{
    res.render("add",{title:"Add Appointments Page"})
});


router.post("/patient",(req,res)=>{
    var id = req.body.username;
    var pass = req.body.password;
    Patient.findOne({
        Patient_ID: id,
        Password: pass,
    })
    .exec((err,results)=>{
        if(results == null){
            res.redirect("/Incorrect");
        }
        else{
        res.redirect("/myapp/"+id);
        }
        });
});

router.get("/myapp/:id",(req,res)=>{
    Appointment.aggregate([ {$match:{Patient_ID:req.params.id}},
    { $lookup: { from: 'doctors', localField: 'Doctor_ID', foreignField: 'Doctor_ID', as: 'Result'}},
    { $lookup: { from: 'patients', localField: 'Patient_ID', foreignField: 'Patient_ID', as: 'Result2'}},
    {  $unwind: '$Result' },
    {  $unwind: '$Result2' },
    {$project: {'_id': 1, 'Appointment_ID':1, 'Result2.Patient_ID':1,'Doctor_ID':1,'ScheduledDay':1,
    'Result.Doctor_ID':1,'Result.Specialization':1,'Result.Phone Number':1,'Result.Fees':1}}])
    .exec((err, appointments)=>{
        if(err){
            res.json({message: err.message});
        }else{
            res.render("myapp",{
                title: "My Appointment Page",
                appointment: appointments,
            });
        }
    });
});

router.get("/about",(req,res)=>{
    Department.aggregate([{$lookup:{ from: 'doctors', localField: 'Doctor_ID', foreignField: 'Doctor_ID', as: 'complex1'}},
    {$lookup:{ from: 'appointments', localField: 'Doctor_ID', foreignField: 'Doctor_ID', as: 'complex2'}},
    {$lookup:{ from: 'Patient', localField: 'Patient_ID', foreignField: 'Patient_ID', as: 'complex3'}},
    {$unwind: {path: '$complex1'}},
    {$unwind: {path: '$complex2'}},
    {$unwind: {path: '$complex3'}}
])
    .exec((err,complex)=>{
        if(err){
            res.json({message: err.message});
        }else{
            res.render("about",{
                title: "About Page",
                complex2: complex,
            });
        }
    });
});

router.get("/doc1/:id",(req,res)=>{
    Appointment.aggregate([{$match:{Doctor_ID:req.params.id}},
        { $lookup: { from: 'patients', localField: 'Patient_ID', foreignField: 'Patient_ID', as: 'Result2'}},
        {$lookup:{ from: 'doctors', localField: 'Doctor_ID', foreignField: 'Doctor_ID', as: 'Result'}},
        {  $unwind: '$Result2' },
        {  $unwind: '$Result3' },
    {$project:{'_id':0,'Appointment_ID':0,'Patient_ID':0,'Result2._id':0}}]).exec((err, complex)=>{
        if(err){
            res.json({message: err.message});
        }else{
            res.render("doc1",{
                title: "Doctor Appointments Page 1",
                complex: complex,
                id: req.params.id,
            });
        }
    });
});

router.get("/myapp",(req,res)=>{
    Appointment.exec((err, appointments)=>{
        if(err){
            res.json({message: err.message});
        }else{
            res.render("myapp",{
                title: "My Appointment Page",
                appointment: appointments,
            });
        }
    });
});

router.post("/add",(req,res)=>{
    console.log(req.body.patientid);
    const appointment = new Appointment();
        appointment._id = new mongoose.Types.ObjectId();
        appointment.Patient_ID = req.body.patientid;
        appointment.Doctor_ID = req.body.doctorid;
        appointment.ScheduledDay = req.body.new_date;
    appointment.save((err,appointment)=>{
        if(err){
            res.json({message: err.message,type:'danger'});
        }else{
            res.render("add",{
                title: "Add Appointments Page",
            });
        }
    });
});

router.get('/edit/:id',(req,res)=>{
    let id = req.params.id;
    console.log(id);
    Appointment.findById(mongoose.Types.ObjectId(id),(err,appointment)=>{
        if(err){
            res.redirect("/");
        }else{
            res.render("edit",{
                title: "Edit User Page",
                id: id,
            });
        }
    });
});

router.post("/update/:id",(req,res)=>{
    let id= req.params.id;
    Appointment.findByIdAndUpdate(mongoose.Types.ObjectId(id),{
        Doctor_ID: req.body.doctorid,
        ScheduledDay: req.body.new_date,
    },(err,result)=>{
        if(err){
            res.json({message: err.message, type:'danger'});
        }else{
            req.session.message={
                type: 'Success',
                message: "Appointment Updated"
            };
            res.redirect("/"); 
        }
    });
}); 

router.get("/delete/:id", (req,res)=>{
    let id = req.params.id;
    Appointment.findByIdAndRemove(mongoose.Types.ObjectId(id), (err,result)=>{
        console.log(result);
        if(err){
            res.json({message: err.message});
        }else{
            req.session.message={
                type: "info",
                message: "User deleted successfully"
            };
            res.redirect("/");
        }
    });
});

router.get("/doc1/:id",(req,res)=>{
    Appointment.aggregate([{$match:{Patient_ID:'P119'}}, 
    { $lookup: { from: 'patients', localField: 'Patient_ID', foreignField: 'Patient_ID', as: 'Result2'}},
    {$project:{'_id':0,'Appointment_ID':0,'Patient_ID':0,'Result2._id':0}}
    ]).exec((err, complex)=>{
        if(err){
            res.json({message: err.message});
        }else{
            res.render("doc1",{
                title: "Doctor Appointments Page 1",
                appointment: complex,
            });
        }
    });
});

module.exports = router;
