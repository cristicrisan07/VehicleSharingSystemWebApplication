export const STRINGS = {
    ADMIN_LOGIN_URL: "http://localhost:8080/vsss/administrator/authenticate",
    MANAGER_LOGIN_URL: "http://localhost:8080/vsss/manager/authenticate",
    INSERT_COMPANY_URL:"http://localhost:8080/vsss/administrator/addCompany",
    INSERT_MANAGER_URL:"http://localhost:8080/vsss/administrator/addManager",
    INSERT_VEHICLE_URL:"http://localhost:8080/vsss/manager/addVehicle",
    UPDATE_COMPANY_URL:"http://localhost:8080/vsss/administrator/updateCompany",
    UPDATE_MANAGER_URL:"http://localhost:8080/vsss/administrator/updateManager",
    UPDATE_VEHICLE_URL:"http://localhost:8080/vsss/manager/updateVehicle",
    DELETE_COMPANY_URL:"http://localhost:8080/vsss/administrator/deleteCompany/",
    DELETE_MANAGER_URL:"http://localhost:8080/vsss/administrator/deleteManager/",
    DELETE_VEHICLE_URL:"http://localhost:8080/vsss/manager/deleteVehicle/",
    GET_VEHICLES_FROM_COMPANY_URL:"http://localhost:8080/vsss/manager/getVehiclesOfCompany/",
    GET_ALL_COMPANIES_URL:"http://localhost:8080/vsss/administrator/getCompanies",
    GET_ALL_MANAGERS_URL:"http://localhost:8080/vsss/administrator/getManagers",
    REGEX_EMAIL:"^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$",
    REGEX_PERSON_NAME:"[a-zA-Z]+",
    REGEX_VIN:"^[a-zA-Z0-9]+$",
    REGEX_PASSWORD:"^(.{0,7}|[^0-9]*|[^A-Z]*|[^a-z]*|[a-zA-Z0-9]*)$",
    REGEX_PHONENUMBER:"^[\\+]?[(]?[0-9]{3}[)]?[-\\s\\.]?[0-9]{3}[-\\s\\.]?[0-9]{4,6}$",
    EMPTY_NAME_ERROR:"You must provide a name.",
    EMPTY_PASSWORD_ERROR:"You must provide a password.",
    EMPTY_USERNAME_ERROR:"You must provide a username.",
    EMPTY_EMAIL_ERROR:"You must provide an email address.",
    EMPTY_PHONENUMBER_ERROR:"You must provide a phone number.",
    INVALID_EMAIL:"Invalid email address",
    INVALID_PERSON_NAME:"Invalid name",
    INVALID_PHONENUMBER:"Invalid phone number",
    INVALID_PASSWORD:"Password should contain minimum eight characters, at least one uppercase letter, one lowercase letter and one number",
    STATUS_VALID:"valid",
    NO_COMPANY_CHOSEN:"You have to choose a company",
    NO_MANUFACTURER_CHOSEN:"You have to choose a manufacturer",
    NO_MODEL_CHOSEN:"You have to choose a model",
    NO_LOCATION_SELECTED:"Please select a location",
    EMPTY_FIELD_ERROR:" field cannot be empty",
    NUMERIC_FIELD_ERROR:" field should contain only numeric characters",
    ALPHANUMERIC_FIELD_ERROR:" field should contain only alphanumeric characters",
    MAPS_API_KEY:"AIzaSyBxxgHJqHizA_wMGVJgEDEHUI9AUW3jBko"
}



export const LocalStorageKeys = {
    USER: 'user',
    COMPANY_NAME:'company_name'
}
export const UserRoles = {
    ADMINISTRATOR: 'administrator',
    MANAGER: 'manager'
}
export function getLocalItem(key) {
    const value = localStorage.getItem(key);
    return value !== null ? JSON.parse(value) : value;
}
export function setLocalItem(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}
export function removeLocalItem(key){
    localStorage.removeItem(key);
}
export function isLoggedIn() {
    return getLocalItem(LocalStorageKeys.USER) !== null;
}

export function isAuthorized(authority) {
    const loggedInUser = getLocalItem(LocalStorageKeys.USER);
    return loggedInUser !== null && loggedInUser.role === authority;
}