// const key = Math.random().toString()
const { body, validationResult } = require("express-validator")
const express = require("express");
const expressLayout = require("express-ejs-layouts")
const session = require("express-session");
const cookieParser = require("cookie-parser");
const CryptoJS = require("crypto-js");
const auth = require("./sistem/auth");
const app = express()
const port = 3000
const key = auth.key;
const cron = require("node-cron");
const bodyParser = require("body-parser")
const methodOverridde = require("method-override");

require("./sistem/db");
const { Pendapatans } = require("./modal/pendapatan.js");
const { Pemiliks } = require("./modal/pemilik.js");

// konfigurasi session 
app.set("view engine", "ejs");

// middleware
app.use(methodOverridde("_method"))
app.use(cookieParser());
app.use(express.static("public"))
app.use(expressLayout);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.raw({ type: 'multipart/form-data' }));
app.use(session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 3600 * 1000,
        httpOnly: true,
    }
}))



cron.schedule("*/1 * * * *", () => {
    console.log("muncul cuman 1 dan permenit")
})


app.get("/", auth.checkLogin, async (req, res) => {
    if(req.query.find){
        const find = await Pendapatans.find({_id:req.query.find})
        res.json(find)
        return;
    }
    const pendapatan = await Pendapatans.find().sort({ tanggal: -1 });
    res.render("home", {
        layout: "layout/template",
        title: "HomePage",
        pendapatan,
        no:1,
    })
})

app.post("/home", auth.checkLogin, async (req, res) => {
    req.body.tanggal = new Date();
    let newPendapatan;

        newPendapatan = await Pendapatans.insertMany(req.body)
        const userPemilik = await Pemiliks.find({_id:"643f9f89a2b870c355eff09a"}) 
        if(req.body.opsi === "untung"){
            const hasil = Number(userPemilik[0].tabungan) + Number(req.body.pendapatan)
            Pemiliks.updateOne(
                {_id:"643f9f89a2b870c355eff09a"},
                {
                    $set:{
                        tabungan:Number(hasil),
                    },
                },
            )
        }else{
            const hasil = Number(userPemilik[0].tabungan) - Number(req.body.pendapatan)
            Pemiliks.updateOne(
                {_id:"643f9f89a2b870c355eff09a"},
                {
                    $set:{
                        tabungan:hasil,
                    },
                },
            )
        }

    res.json(newPendapatan)
})

app.delete("/home",auth.checkLogin,async (req,res) => {
    try{
       await Pendapatans.deleteOne({_id:req.body.id})
    }catch{
        res.redirect("/")
    }
    res.redirect("/")
})

app.put("/home",auth.checkLogin,async(req,res) => {
    await Pendapatans.updateOne(
        {_id:req.body.id},
        {
            $set:{
                kegiatan:req.body.kegiatan,
                pendapatan:req.body.pendapatan,
                opsi:req.body.opsi,
            },
        },
    )
    res.redirect("/");
})

app.get("/login", (req, res) => {
    if (req.session.loggedIn) {
        res.redirect("/");
    } else {
        res.render("login", {
            layout: "layout/template",
            title: "Login",
            data: '',
        })
    }
})

app.post("/login", (req, res) => {
    const user = auth.login(req.body.email, req.body.password)
    if (user) {
        req.session.loggedIn = CryptoJS.AES.encrypt(JSON.stringify(user), key).toString();
        if (req.body.remember) {
            const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(user), key).toString();
            res.cookie("remember", encryptedData, { maxAge: 3600000, httpOnly: true, secure: true })
        }
        res.redirect("/")
    } else {
        res.render("login", {
            layout: "layout/template",
            title: "Login",
            data: req.body,
        })
    }
})

app.post("/logout", (req, res) => {
    req.session.destroy();
    res.clearCookie("remember")
    res.redirect("/login")
})


app.use((req, res) => {
    res.send("Not Found")
})

app.listen(port, () => {
    console.log(`Server Nyalan Pada Port${port}`)
})

