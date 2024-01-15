require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");

mongoose.set("strictQuery", false);
mongoose.connect(process.env.DB_URI, {useNewUrlParser: true, useUnifiedTopology: true});
let ejs = require('ejs');

const app = express();
const db = mongoose.connection;
db.on('error',(error)=> console.log(error));
db.once('open',()=> console.log("Connected to the database"));

//middlewares
app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.use(
    session({
    secret: 'my secret key',
    saveUninitialized: true,
    resave: false,
    })
);

app.use((req, res, next)=>{
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
});


app.set('views','./views');
app.set('view engine','ejs');
//app.use("view engine","ejs");

app.use("",require("./routes/routes"));

app.use(bodyParser.urlencoded({extended:true}));

app.get("/",(req,res)=>{  
    res.render('test',{test:' Success'});
});

app.get("/doctor",(req,res)=>{
    res.sendFile(__dirname+"/doctor.html");
});

app.post("/doctor",(req,res)=>{
    console.log(req.body);
    var id = req.body.username;
    var pass = req.body.password;
    var result = id+pass;
    res.send(result);
});

app.get("/patient",(req,res)=>{
    res.sendFile(__dirname+"/Patient.html");
});

app.get("/appointment",(req,res)=>{
    res.sendFile(__dirname+"/appointment.html");
});

app.listen(3000,()=>{
    console.log("Server start on server 3000");
});