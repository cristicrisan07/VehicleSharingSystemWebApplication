import {
    LocalStorageKeys,
    getLocalItem,
    setLocalItem,
    UserRoles, STRINGS, removeLocalItem, TimeUnits,
} from "./Utils";

export const doLogin = async(e,username, password,type) => {
    const loginURL = type === UserRoles.ADMINISTRATOR ? STRINGS.ADMIN_LOGIN_URL : STRINGS.MANAGER_LOGIN_URL;
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

        return type === UserRoles.ADMINISTRATOR ? res.text() : res.json();
    }).then(function(res){
        let user = {
            username: username,
            role: type,
            token: type === UserRoles.ADMINISTRATOR ? res : res.token
        };
        if(type === UserRoles.MANAGER) {
            setLocalItem(LocalStorageKeys.COMPANY_NAME, res.companyName)
        }
        setLocalItem(LocalStorageKeys.USER, user)
    });
}
export const doLogout = (isManager,navigate) => {
    removeLocalItem(LocalStorageKeys.USER)
    if(isManager){
        removeLocalItem(LocalStorageKeys.COMPANY_NAME)
    }
    navigate("/login")

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
        timeUnit:timeunit
    }
}
export function createVehicleDTO(VIN,registrationNumber, manufacturer, model, range, year, hp, torque, mam, nb_seats,location, price,companyName,availability){
    return{
        vin:VIN,
        registrationNumber:registrationNumber,
        manufacturer:manufacturer,
        model:model,
        rangeLeftInKm:range,
        yearOfManufacture:year,
        horsePower:hp,
        torque:torque,
        maximumAuthorisedMassInKg:mam,
        numberOfSeats:nb_seats,
        location:location,
        rentalPriceDTO:createRentalPriceDTO(price,"RON",TimeUnits.MINUTE),
        rentalCompanyName:companyName,
        available:availability
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

export function createSubscriptionDTO(id,name,kilometersLimit,rentalPriceValue,timeUnit){
    return {
        id:id,
        name:name,
        kilometersLimit:kilometersLimit,
        rentalPriceDTO:createRentalPriceDTO(rentalPriceValue,"RON",timeUnit)
    }
}

export function createDocumentStatusDTO(username,status){
    return {
        driverUsername:username,
        validationStatus:status
    }
}