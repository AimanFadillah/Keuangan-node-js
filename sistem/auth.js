const fs = require("file-system");

const dataUsers = () => {
    const buffer = fs.readFileSync("./data/user.json","utf-8")
    const user = JSON.parse(buffer); 
    return user;
}



function login(email,password){
    const users = dataUsers()
    const data = users.find(user => user.email === email);
    if(data && data.password === password){
        delete data.password
        return data;
    }else {
        return false;
    }
}

module.exports = {login}