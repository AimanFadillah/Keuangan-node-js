const fs = require("file-system");
const CryptoJS = require("crypto-js")
const key = "123"

const dataUsers = () => {
    const buffer = fs.readFileSync("./data/user.json","utf-8")
    const user = JSON.parse(buffer); 
    return user;
}

function login(email,password){
    const users = dataUsers()
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