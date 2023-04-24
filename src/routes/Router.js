import React from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {UserRoles} from "../services/Utils";
import {ManagerLoginPage} from "../pages/ManagerLoginPage";
import {AdminLoginPage} from "../pages/AdminLoginPage";
import {ProtectedPage} from "../components/Security/ProtectedPage";
import {AdminHomepage} from "../pages/AdminHomepage";
import {ManagerHomepage} from "../pages/ManagerHomepage";
export const Router = () =>{

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<ProtectedPage component={<ManagerHomepage/>} redirectLink={"/login"} authority={UserRoles.MANAGER}/>}/>
                <Route path="/admin" element={<ProtectedPage component={<AdminHomepage/>} redirectLink={"/admin/login"} authority={UserRoles.ADMINISTRATOR}/>}/>
                <Route path="/admin/login" element={<AdminLoginPage/>}/>
                <Route path="/login" element={<ManagerLoginPage/>}/>
            </Routes>
        </BrowserRouter>
    );
}