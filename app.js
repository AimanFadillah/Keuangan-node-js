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
const idPemilik = "643f9f89a2b870c355eff09a";
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



// HARIAN 
cron.schedule("0 22 * * *", async () => {
    const userPemilik = await Pemiliks.find({_id:idPemilik})
    if(userPemilik[0].perhari !== 0){

        const newPendapatan = await Pendapatans.insertMany({
            kegiatan: "Harian",
        pendapatan: userPemilik[0].perhari,
        opsi:"untung",
        tanggal : new Date(),
        })
        const hasil = Number(userPemilik[0].tabungan) + Number(userPemilik[0].perhari)
        Pemiliks.updateOne(
            {_id:idPemilik},
                {
                    $set:{
                        tabungan:hasil,
                    },
                },
            )
        .then(() => {
            const text = "success";
        })
    }
    Pendapatans.find()
    .then( async data => {
        const limit = data.length - 20;
        if(limit > 0){
            for(let a = 0;a < limit;a++){
                await Pendapatans.deleteOne({_id:data[a]["_id"]})
            }
        }
    })
});

// MINGGUAN
cron.schedule("30 16 * * 1", async () => {
    const userPemilik = await Pemiliks.find({_id:idPemilik})
    if(userPemilik[0].perminggu !== 0){

        const newPendapatan = await Pendapatans.insertMany({
            kegiatan: "Mingguan",
        pendapatan: userPemilik[0].perminggu,
        opsi:"untung",
        tanggal : new Date(),
        })
        const hasil = Number(userPemilik[0].tabungan) + Number(userPemilik[0].perminggu)
        Pemiliks.updateOne(
            {_id:idPemilik},
                {
                    $set:{
                        tabungan:hasil,
                    },
                },
            )
        .then(() => {
            const text = "success";
        })
    }
});

// BULANAN
cron.schedule("0 12 1 * *",async () => {
    const userPemilik = await Pemiliks.find({_id:idPemilik})
    if(userPemilik[0].perbulan !== 0){

        const newPendapatan = await Pendapatans.insertMany({
            kegiatan: "Bulanan",
        pendapatan: userPemilik[0].perbulan,
        opsi:"untung",
        tanggal : new Date(),
        })
        const hasil = Number(userPemilik[0].tabungan) + Number(userPemilik[0].perbulan)
        Pemiliks.updateOne(
            {_id:idPemilik},
                {
                    $set:{
                        tabungan:hasil,
                    },
                },
            )
        .then(() => {
            const text = "success";
        })
    }
});



app.get("/", auth.checkLogin, async (req, res) => {
    if(req.query.find){
        const find = await Pendapatans.find({_id:req.query.find})
        res.json(find)
        return;
    }
    const pendapatan = await Pendapatans.find().sort({ tanggal: -1 });
    const tabungan = await Pemiliks.find({_id:idPemilik})
    res.render("home", {
        layout: "layout/template",
        title: "HomePage",
        pendapatan,
        no:1,
        pemilik:tabungan[0]
    })
})

app.post("/penghasilan",auth.checkLogin,async (req,res) => {
    if(req.query.updateHarian === "true"){
        Pemiliks.updateOne(
            {_id:idPemilik},
            {
                $set:{
                    perhari:req.body.isi,
                },
            },
        )
        .then(() => {
            res.json("success")
        })
    }else
    if(req.query.updateMingguan === "true"){
        Pemiliks.updateOne(
            {_id:idPemilik},
            {
                $set:{
                    perminggu:req.body.isi,
                },
            },
        )
        .then(() => {
            res.json("success")
        })
    }else
    if(req.query.updateBulanan === "true"){
        Pemiliks.updateOne(
            {_id:idPemilik},
            {
                $set:{
                    perbulan:req.body.isi,
                },
            },
        )
        .then(() => {
            res.json("success")
        })
    }
})

app.post("/home", auth.checkLogin, async (req, res) => {
    req.body.tanggal = new Date();
    const newPendapatan = await Pendapatans.insertMany(req.body)
    const userPemilik = await Pemiliks.find({_id:idPemilik}) 
    if(req.body.opsi === "untung"){
        const hasil = Number(userPemilik[0].tabungan) + Number(req.body.pendapatan)
        newPendapatan[0].pendapatan = hasil;
        Pemiliks.updateOne(
                {_id:idPemilik},
                {
                    $set:{
                        tabungan:hasil,
                    },
                },
            )
            .then(() => {
                res.json(newPendapatan)
            })
        }else{
            const hasil = Number(userPemilik[0].tabungan) - Number(req.body.pendapatan)
            newPendapatan[0].pendapatan = hasil;
            Pemiliks.updateOne(
                {_id:idPemilik},
                {
                    $set:{
                        tabungan:hasil,
                    },
                },
            )
            .then(() => {
                res.json(newPendapatan)
            })
        }
})

app.delete("/home",auth.checkLogin,async (req,res) => {
    const jumlahPendapatan = await Pendapatans.find({_id:req.body.id})
    await Pendapatans.deleteOne({_id:req.body.id})
    const userPemilik = await Pemiliks.find({_id:idPemilik}) 
    if(jumlahPendapatan[0].opsi === "untung"){
        const hasil = Number(userPemilik[0].tabungan) - Number(jumlahPendapatan[0].pendapatan)
        jumlahPendapatan[0].pendapatan = hasil;
        Pemiliks.updateOne(
                {_id:idPemilik},
                {
                    $set:{
                        tabungan:hasil,
                    },
                },
            )
            .then(() => {
                res.json(jumlahPendapatan)
            })
        }else{
            const hasil = Number(userPemilik[0].tabungan) + Number(jumlahPendapatan[0].pendapatan)
            jumlahPendapatan[0].pendapatan = hasil;
            Pemiliks.updateOne(
                {_id:idPemilik},
                {
                    $set:{
                        tabungan:hasil,
                    },
                },
            )
            .then(() => {
                res.json(jumlahPendapatan)
            })
        }
})

app.put("/home",auth.checkLogin,async(req,res) => {
    const userPemilik = await Pemiliks.find({_id:idPemilik}) 
    const pendapatanOld = await Pendapatans.find({_id:req.body.id})
    let stockOld;
    if(pendapatanOld[0].opsi === "untung"){
        stockOld = Number(userPemilik[0].tabungan) - Number(pendapatanOld[0].pendapatan);
    }else{
        stockOld = Number(userPemilik[0].tabungan) + Number(pendapatanOld[0].pendapatan);
    }

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
    if(req.body.opsi === "untung"){
        const hasil = Number(stockOld) + Number(req.body.pendapatan)
        Pemiliks.updateOne(
                {_id:idPemilik},
                {
                    $set:{
                        tabungan:hasil,
                    },
                },
            )
            .then(() => {
                res.json(hasil)
            })
        }else{
            const hasil = Number(stockOld) - Number(req.body.pendapatan)
            Pemiliks.updateOne(
                {_id:idPemilik},
                {
                    $set:{
                        tabungan:hasil,
                    },
                },
            )
            .then(() => {
                res.json(hasil)
            })
        }
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

