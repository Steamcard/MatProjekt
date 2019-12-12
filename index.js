const mongo = require('mongodb').MongoClient;
const express = require("express");
const conString = "mongodb+srv://Kasper:1231234@cluster0-iczm6.mongodb.net/test?retryWrites=true&w=majority"
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const secret = require("./Login/secret");
const login = require("./Login/login");
const auth = require("./Login/auth");



makeConnection()
async function makeConnection(){
    //Kopplar in oss
    const con = await mongo.connect(conString,{ useNewUrlParser: true, useUnifiedTopology: true });
    //Skapar en veckosedel
    const db = await con.db("Veckosedel");
    //Lägger in maträtter i veckosedeln
    const col = await db.collection("matratter");
    //Kopplar upp oss
    app = express();
    app.use(cookieParser());
    app.use("/Login",express.static(__dirname+"/Login"));

    //Parsa req.body
    app.use(express.urlencoded({extended:false}));
    //Öppnar port 2019
    app.listen(3019, function(){console.log("Porten: 3019")})
    //Lägger en koppling till vår kollektion till vårt app-obejekt
    app.matratter = col;
    //Ladda in vår egen route-module och skicka in app som argument
    require("./router")(app);
    return col;
}

