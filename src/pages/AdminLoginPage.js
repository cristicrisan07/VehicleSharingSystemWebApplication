import "./style/LoginPage.css";
import {doLogin} from "../services/UserService"
import {useNavigate} from "react-router-dom";

export const AdminLoginPage = () => {
    const navigate = useNavigate()
    const onLogin = (e) =>{
        doLogin(e, document.getElementById("usernameInput").value, document.getElementById("passwordInput").value, "administrator")
            .then(_ =>{
                navigate("/admin")
            }).catch(error => {
            console.error('There was an error!: ', error);
        })

    }
    return (
        <div id="main-wrapper" className="container">
            <div className="row justify-content-center">
                <div className="col-xl-10">
                    <div className="row no-gutters">
                        <div className="col-lg-6">
                            <div className="p-5">
                                <form>
                                    <div className="form-group mb-4">
                                        <label htmlFor="usernameInput">Username</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="usernameInput"
                                        />
                                    </div>
                                    <div className="form-group mb-5">
                                        <label htmlFor="passwordInput">Password</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="passwordInput"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        className="btn btn-primary btn-theme"
                                        onClick={(e) =>onLogin(e)}
                                    >
                                        Administrator Login
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};