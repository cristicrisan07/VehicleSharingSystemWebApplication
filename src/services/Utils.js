export const STRINGS = {
    ADMIN_LOGIN_URL: "http://localhost:8080/vsss/administrator/authenticate",
    INSERT_COMPANY_URL:"http://localhost:8080/vsss/administrator/addCompany",
    UPDATE_COMPANY_URL:"http://localhost:8080/vsss/administrator/updateCompany",
    DELETE_COMPANY_URL:"http://localhost:8080/vsss/administrator/deleteCompany/",
    GET_ALL_COMPANIES_URL:"http://localhost:8080/vsss/administrator/getCompanies",
    REGEX_EMAIL:"^[a-zA-Z0–9+_.-]+@[a-zA-Z0–9.-]+$",
    REGEX_PERSON_NAME:"/^[a-z ,.'-]+$/i",
    REGEX_PASSWORD:"^(?=.*[a-z])(?=.*[A-Z])(?=.*d)[a-zA-Zd]{8,}$",
    REGEX_PHONENUMBER:"^[\\+]?[(]?[0-9]{3}[)]?[-\\s\\.]?[0-9]{3}[-\\s\\.]?[0-9]{4,6}$",
    EMPTY_NAME_ERROR:"You must provide a name.",
    EMPTY_PASSWORD_ERROR:"You must provide a password.",
    EMPTY_USERNAME_ERROR:"You must provide a userSname.",
    EMPTY_EMAIL_ERROR:"You must provide an email address.",
    EMPTY_PHONENUMBER_ERROR:"You must provide a phone number.",
    INVALID_EMAIL:"Invalid email address",
    INVALID_PERSON_NAME:"Invalid name",
    INVALID_PHONENUMBER:"Invalid phone number",
    INVALID_PASSWORD:"Password should contain minimum eight characters, at least one uppercase letter, one lowercase letter and one number",
    STATUS_VALID:"valid",
    NO_COMPANY_CHOSEN:"You have to choose a company"
}



export const LocalStorageKeys = {
    USER: 'user',
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
export function isLoggedIn() {
    return getLocalItem(LocalStorageKeys.USER) !== null;
}

export function isAuthorized(authority) {
    const loggedInUser = getLocalItem(LocalStorageKeys.USER);
    return loggedInUser !== null && loggedInUser.role === authority;
}