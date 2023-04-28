const fs = require("file-system");
const CryptoJS = require("crypto-js")
const key = "M1N3CR4FTJ0K0W1P4B0W0G3M1NG"

require("../sistem/db");
const { Pemiliks } = require("../modal/pemilik.js");

const dataUsers = async () => {
    const data = await Pemiliks.find({_id:"643f9f89a2b870c355eff09a"})
    return data;
}

async function login(email,password){
    const users = await dataUsers()
    const data = users.find(user => user.email === email);
    if(data){
        const hasPas = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex)
        if(data.password === hasPas){
            delete data.password
            return data
        }
        return false;
    }else {
        return false;
    }
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
            req.session.destroy()
            console.log(decryted);
            res.redirect("/login")
        }

        if(decryted){
            req.session.loggedIn = CryptoJS.AES.encrypt(JSON.stringify(decryted),key).toString();
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


module.exports = {login,checkLogin,key,decryptSession}