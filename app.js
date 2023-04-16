const express = require("express");
const expressLayout = require("express-ejs-layouts")
const session = require("express-session");
const cookieParser = require("cookie-parser");
// const validator = require("express-validator")
const CryptoJS = require("crypto-js");
const auth = require("./sistem/auth");
const app = express()
const port = 3000
const key = Math.random().toString()
const cron = require("node-cron");

// konfigurasi session 
app.use(session({
    secret:"secret-key",
    resave:false,
    saveUninitialized:true,
    cookie:{
        maxAge: 3600 * 1000,
        httpOnly:true,
    }
}))

app.use(cookieParser());

app.set("view engine","ejs");
app.use(expressLayout);
app.use(express.urlencoded({ extended:true }));

function cronJob () {
    cron.schedule("*/1 * * * *",() => {
        console.log("muncul cuman 1 dan permenit")
    })
}

function checkLogin(req,res,next){
    if(req.session.loggedIn){
        next()
    }else if(req.cookies.remember){
        let decryted = null;
        const remember = req.cookies.remember;
        try{
            const bytes = CryptoJS.AES.decrypt(remember,key);
            decryted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        }catch{
            res.clearCookie("remember");
            res.session.destroy()
            res.redirect("/login")
        }

        if(decryted){
            req.session.loggedIn = CryptoJS.AES.encrypt(JSON.stringify(decryted),key).toString();
            cronJob()
            next()
        }
    }
    else{
        res.redirect("/login")
    }
}

function decryptSession (has) {
    const data = CryptoJS.AES.decrypt(has,key)
    const result = JSON.parse(data.toString(CryptoJS.enc.Utf8))
    return result;
}


app.get("/",checkLogin,(req,res) => {
    const user = decryptSession(req.session.loggedIn);
    res.render("home",{
        layout:"layout/template",
        title:"HomePage",
        user,
    })
})


app.get("/login",(req,res) => {
    if(req.session.loggedIn){
        res.redirect("/");
    }else {
        res.render("login",{
            layout:"layout/template",
            title:"Login",
        })
    }
})

app.post("/login",(req,res) => {
    const user = auth.login(req.body.email,req.body.password)
    if(user){
        req.session.loggedIn  = CryptoJS.AES.encrypt(JSON.stringify(user),key).toString();
        if(req.body.remember){
            const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(user), key).toString();
            res.cookie("remember",encryptedData,{ maxAge: 3600000, httpOnly: true, secure: true })
        }
        res.redirect("/")
    }else{
        res.redirect("/login")
    }
})

app.post("/logout",(req,res) => {
    req.session.destroy();
    res.clearCookie("remember")
    res.redirect("/login")
})






app.use((req,res) => {
    res.send("Not Found")
})

app.listen(port,() =>{
    console.log(`Server Nyalan Pada Port${port}`)
})