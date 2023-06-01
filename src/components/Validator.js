import {STRINGS} from "../services/Utils";

function validateEmailAndPhoneNumber(email,phoneNumber){
    if (phoneNumber === "") {
        return(STRINGS.EMPTY_PHONENUMBER_ERROR);
    }else{
        if(phoneNumber.match(STRINGS.REGEX_PHONENUMBER)===null){
            return(STRINGS.INVALID_PHONENUMBER)
        }
    }
    if (email === "") {
        return(STRINGS.EMPTY_EMAIL_ERROR);
    }else{
        if(email.match(STRINGS.REGEX_EMAIL)===null){
            return(STRINGS.INVALID_EMAIL)
        }
    }
    return STRINGS.STATUS_VALID;
}
export default function validateCompanyData(name,email,phoneNumber){
    if (name === "") {
        return (STRINGS.EMPTY_NAME_ERROR);
    }
    return validateEmailAndPhoneNumber(email,phoneNumber);
}

export function validateAccountData(username, password, phoneNumber, email, firstName,lastName,isNewAccount){
    if(username === ""){
        return STRINGS.EMPTY_USERNAME_ERROR
    }

    if(isNewAccount && password === ""){
        return STRINGS.EMPTY_PASSWORD_ERROR;
    }
    if(password !== "" && password.match(STRINGS.REGEX_PASSWORD)!==null){
        return STRINGS.INVALID_PASSWORD
    }

    if (firstName === "" || lastName === "" ) {
        return  STRINGS.EMPTY_NAME_ERROR
    }
    else{
     if(firstName.match(STRINGS.REGEX_PERSON_NAME)===null ||
         lastName.match(STRINGS.REGEX_PERSON_NAME)===null){
         return STRINGS.INVALID_PERSON_NAME
     }
    }
    return validateEmailAndPhoneNumber(email,phoneNumber)
}
export function validateVehicleData(VIN,registrationNumber,range,year,hp,torque,mam,nb_seats,price){
    if(VIN === ""){
        return "VIN"+STRINGS.EMPTY_FIELD_ERROR;
    }
    else{
        if(VIN.match(STRINGS.REGEX_VIN)===null){
            return "VIN "+STRINGS.ALPHANUMERIC_FIELD_ERROR;
        }else{
            if(VIN.length !== 17){
                return "VIN code should consist of 17 characters.";
            }
        }
    }
    if(registrationNumber === ""){
        return "Registration Number"+STRINGS.EMPTY_FIELD_ERROR;
    }
    else{
        if(registrationNumber.match(STRINGS.REGEX_VIN)===null){
            return "Registration Number "+STRINGS.ALPHANUMERIC_FIELD_ERROR;
        }
    }
    if(range === ""){
        return "Range"+STRINGS.EMPTY_FIELD_ERROR;
    }
    else{
        if(isNaN(parseInt(range))){
            return "Range"+STRINGS.NUMERIC_FIELD_ERROR;
        }
    }
    if(year === ""){
        return "Year"+STRINGS.EMPTY_FIELD_ERROR;
    }
    else{
        if(isNaN(parseInt(year))){
            return "Year"+STRINGS.NUMERIC_FIELD_ERROR;
        }
    }
    if(hp === ""){
        return "Horse power"+STRINGS.EMPTY_FIELD_ERROR;
    }
    else{
        if(isNaN(parseInt(hp))){
            return "Horse power"+STRINGS.NUMERIC_FIELD_ERROR;
        }
    }
    if(torque === ""){
        return "Torque"+STRINGS.EMPTY_FIELD_ERROR;
    }
    else{
        if(isNaN(parseInt(torque))){
            return "Torque"+STRINGS.NUMERIC_FIELD_ERROR;
        }
    }
    if(mam === ""){
        return "Maximum authorized mass"+STRINGS.EMPTY_FIELD_ERROR;
    }
    else{
        if(isNaN(parseInt(torque))){
            return "Maximum authorized mass"+STRINGS.NUMERIC_FIELD_ERROR;
        }
    }
    if(nb_seats === ""){
        return "Number of seats"+STRINGS.EMPTY_FIELD_ERROR;
    }
    else{
        if(isNaN(parseInt(nb_seats))){
            return "Number of seats"+STRINGS.NUMERIC_FIELD_ERROR;
        }
    }
    if(price === ""){
        return "Price "+STRINGS.EMPTY_FIELD_ERROR;
    }
    else{
        if(isNaN(parseFloat(price))){
            return "Price field should have a decimal value"
        }
    }
    return STRINGS.STATUS_VALID

}

export function validateSubscriptionData(name,kilometersLimit,rentalPriceValue){

    if(name === ""){
        return "Name"+STRINGS.EMPTY_FIELD_ERROR;
    }

    if(kilometersLimit === ""){
        return "Kilometers limit"+STRINGS.EMPTY_FIELD_ERROR;
    }
    else{
        if(isNaN(parseInt(kilometersLimit))){
            return "Kilometers limit"+STRINGS.NUMERIC_FIELD_ERROR;
        }
    }

    if(rentalPriceValue === ""){
        return "Price "+STRINGS.EMPTY_FIELD_ERROR;
    }
    else{
        if(isNaN(parseFloat(rentalPriceValue))){
            return "Price field should have a decimal value"
        }
    }

    return STRINGS.STATUS_VALID
}