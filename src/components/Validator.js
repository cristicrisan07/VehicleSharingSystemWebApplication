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

export function validateAccountData(username, password, phoneNumber, email, firstName,lastName){
    if(username === ""){
        return STRINGS.EMPTY_USERNAME_ERROR
    }

    if(password !== "" && password.match(STRINGS.REGEX_PHONENUMBER)===null){
        return STRINGS.INVALID_PASSWORD
    }

    if (firstName === "" || lastName === "" ) {
        return  STRINGS.EMPTY_NAME_ERROR
    }
    else{
     if(firstName.match(STRINGS.REGEX_PHONENUMBER)===null ||
         lastName.match(STRINGS.REGEX_PHONENUMBER)===null){
         return STRINGS.INVALID_PERSON_NAME
     }
    }
    return validateEmailAndPhoneNumber(email,phoneNumber)


}