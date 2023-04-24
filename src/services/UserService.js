import {
    LocalStorageKeys,
    getLocalItem,
    setLocalItem,
    UserRoles, STRINGS,
} from "./Utils";

export const doLogin = async(e,username, password,type) => {
    const loginURL = type === "administrator" ? STRINGS.ADMIN_LOGIN_URL : STRINGS.MANAGER_LOGIN_URL;
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
        if(res.status === 403){
            return Promise.reject("Wrong credentials");
        }
        return res.text();
    }).then(function(token){
        let role = type === "administrator" ? UserRoles.ADMINISTRATOR : UserRoles.MANAGER
        let user = {
            username: username,
            role: role,
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
export function createRentalPriceDTO(value,currency,timeunit){
    return{
        value:value,
        currency:currency,
        timeunit:timeunit
    }
}
export function createVehicleDTO(VIN, manufacturer, model, range, year, hp, torque, mam, nb_seats,location, price,companyName){
    return{
        vin:VIN,
        manufacturer:manufacturer,
        model:model,
        rangeLeftInKm:range,
        yearOfManufacture:year,
        horsePower:hp,
        torque:torque,
        maximumAuthorisedMassInKg:mam,
        numberOfSeats:nb_seats,
        location:location,
        rentalPriceDTO:createRentalPriceDTO(price,"dollar","minute"),
        rentalCompanyName:companyName
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