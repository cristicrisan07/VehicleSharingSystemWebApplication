import "./style/LoginPage.css";
import {doLogin} from "../services/UserService"

export const LoginPage = () => {

    return (
        <div id="main-wrapper" className="container">
            <div className="row justify-content-center">
                <div className="col-xl-10">
                    <div className="row no-gutters">
                        <div className="col-lg-6">
                            <div className="p-5">
                                <div className="mb-5">
                                    <h3 className="h4 font-weight-bold text-theme">
                                        Vehicle Sharing Web Application
                                    </h3>
                                </div>
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
                                        onClick={(e) =>doLogin(e,document.getElementById("usernameInput").value,document.getElementById("passwordInput").value)}
                                    >
                                        Login
                                    </button>
                                </form>
                            </div>
                        </div>
                        <div className="col-lg-6 d-none d-lg-inline-block">
                            <div className="account-block rounded-right">
                                <div className="overlay rounded-right"></div>
                                <div className="account-testimonial"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};