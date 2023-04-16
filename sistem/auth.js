const fs = require("file-system");
const CryptoJS = require("crypto-js")

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

module.exports = {login}