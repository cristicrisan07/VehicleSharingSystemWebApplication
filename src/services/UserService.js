import {
    LocalStorageKeys,
    getLocalItem,
    setLocalItem,
    UserRoles, STRINGS,
} from "./Utils";
import { Link, useNavigate } from "react-router-dom";


export const doLogin = async(e,username, password,type) => {
    const loginURL = type === "admin" ? STRINGS.ADMIN_LOGIN_URL : "";
    let d = {
        username: username,
        password: password,
        phoneNumber:"",
        emailAddress:"",
        accountType:""
    }
    await fetch(loginURL, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(d)
    }).then(function (res) {
        return res.text()
    }).then(function(token){
        let user = {
            username: username,
            role: UserRoles.ADMINISTRATOR,
            token:token
        };
        setLocalItem(LocalStorageKeys.USER, user)
    });
}
function createUserDTO(username, password, phoneNumber, email, accountType, firstName,lastName) {
    return{
        firstName:firstName,
        lastName:lastName,
        account:createAccountDTO(username,password,phoneNumber,email,accountType)
    }
}
export function createRentalCompanyManagerDTO(username, password, phoneNumber, email, accountType, firstName,lastName,companyName) {
    return{
        userDTO:createUserDTO(username, password, phoneNumber, email, accountType, firstName,lastName),
        companyName:companyName
    }
}
const createAccountDTO = (username, password, phoneNumber, email, accountType) =>{
    return {
        username:username,
        password:password,
        phoneNumber:phoneNumber,
        emailAddress:email,
        accountType:accountType
    }
}