import React from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {isAuthorized, isLoggedIn, LocalStorageKeys, UserRoles} from "../services/Utils";
import {LoginPage} from "../pages/LoginPage";
import {RegisterPage} from "../pages/RegisterPage";
import {AdminLoginPage} from "../pages/AdminLoginPage";
import {ProtectedPage} from "../components/Security/ProtectedPage";
import {AdminHomepage} from "../pages/AdminHomepage";
export const Router = () =>{

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginPage/>}/>
                <Route path="/admin" element={<ProtectedPage component={<AdminHomepage/>} redirectLink={"/admin/login"} authority={UserRoles.ADMINISTRATOR}/>}/>
                <Route path="/admin/login" element={<AdminLoginPage/>}/>
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/register" element={<RegisterPage/>}/>
            </Routes>
        </BrowserRouter>
    );
}