import { useNavigate } from "react-router-dom"
import { ROUTER_KEYS } from "../../router/router-keys"
import { useEffect, useState } from "react";
import "./AuthPage.scss"

type PageView = "login" | "forgotPassword"

export default function Login() {

    const navigate = useNavigate()
    const [pageViewType, updatePageView] = useState<PageView>("login");
    const [passwordFieldType, updatePasswordFieldType] = useState<"text" | "password">("password")

    useEffect(() => {
        sessionStorage.clear()
        document.body.setAttribute("app-data-theme", "light");
        document.body.setAttribute("data-bs-theme", "light");
    }, [])

    function setPasswordFieldView() {
        if (passwordFieldType === "password") {
            updatePasswordFieldType("text")
        } else {
            updatePasswordFieldType("password")
        }
    }

    function setPageViewType(selected: PageView) {
        updatePageView(selected)
    }

    function openSignUp() {
        navigate(ROUTER_KEYS.sign_up.url)
    }

    function verifyUser() {
        const data: Record<string, string> = {
            "currency_name": "Indian Rupee",
            "time_zone": "Asia/Kolkata",
            "currency_icon": "fa-solid fa-indian-rupee-sign",
            "username": "sai_teja",
            "currency_decimal_digits": "2",
            "currency_code": "INR",
            "currency_html_code": "&#8377;",
            "user_alias": "Sai Teja",
            "user_email": "saitejaspl1223@gmail.com",
            "currency_id": "64b27971e7183199c4ebfb32",
            "currency_name_plural": "Indian rupees",
        }
        for (let key in data) {
            sessionStorage.setItem(key, data[key])
        }
        navigate(ROUTER_KEYS.dashboard.url)
    }

    return (
        <>
            <div className="auth-page">
                <div className="auth-container">
                    <div className="logo-container">
                        <img src="src/assets/images/logos/finex-logo-dark.png" alt="" />
                    </div>
                    {
                        pageViewType === "login" &&
                        <div className="form-container">
                            <div className="form-data">
                                <form onSubmit={verifyUser}>
                                    <div className="form-group mb-3">
                                        <label htmlFor="user-name" className="field-required">User Name</label>
                                        <input type="text" className="form-control" name="user-name" id="user-name" />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="user-password" className="field-required">Password</label>
                                        <input type={passwordFieldType} className="form-control" name="user-password" id="user-password" />
                                        <span className="password-view" id="password-view" >
                                            {
                                                passwordFieldType === "password" && <i className="fa fa-eye" onClick={setPasswordFieldView}></i>
                                            }
                                            {
                                                passwordFieldType === "text" && <i className="fa fa-eye-slash" onClick={setPasswordFieldView}></i>
                                            }
                                        </span>
                                    </div>
                                    <div className="form-btn place-holder-glow">
                                        <button className="btn btn-ft-primary w-100" type="submit">Sign In</button>
                                        {/* <div className="placeholder-glow cursor_wait mb-1" >
                                            <a className="btn btn-secondary disabled placeholder w-100 fw-500">Authenticating...</a>
                                        </div> */}
                                    </div>
                                </form>
                            </div>
                            <div className="form-options">
                                <div className="option" onClick={openSignUp}>
                                    Sign Up
                                </div>
                                <div className="option" onClick={() => setPageViewType("forgotPassword")}>
                                    Forgot Password?
                                </div>
                            </div>
                        </div>
                    }
                    {
                        pageViewType === "forgotPassword" &&
                        <div className="form-container">
                            <div className="form-data">
                                <form >
                                    <div className="form-group mb-3">
                                        <label htmlFor="user-name" className="field-required">User Name</label>
                                        <input type="text" className="form-control" name="user-name" id="user-name" />
                                    </div>
                                    <div className="form-group mb-3">
                                        <label htmlFor="user-mail" className="field-required">Mail</label>
                                        <input type="email" className="form-control" name="user-mail" id="user-mail" />
                                    </div>
                                    <div className="form-btn">
                                        <button className="btn btn-ft-primary w-100" type="submit">Send Link</button>
                                    </div>
                                </form>
                            </div>
                            <div className="form-options">
                                <div className="option" onClick={openSignUp}>
                                    Sign Up
                                </div>
                                <div className="option" onClick={() => setPageViewType("login")}>
                                    Back to login
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </>
    )
}