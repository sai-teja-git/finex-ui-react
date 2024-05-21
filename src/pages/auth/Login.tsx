import { useNavigate } from "react-router-dom"
import { ROUTER_KEYS } from "../../router/router-keys"
import { useEffect, useState } from "react";
import "./AuthPage.scss"
import userApiService from "../../api/user.api.service";
import toast from "react-hot-toast";

type PageView = "login" | "forgotPassword";
interface LoginBody {
    user_name: string;
    password: string;
}
interface ForgotPassword {
    user_name: string;
    email: string;
}

import appLogo from "../../assets/images/logos/finex-logo-dark.png"

export default function Login() {

    const navigate = useNavigate()
    const [pageViewType, updatePageView] = useState<PageView>("login");
    const [passwordFieldType, updatePasswordFieldType] = useState<"text" | "password">("password");
    const [errorMessage, updateErrorMessage] = useState("");
    const [signInData, updateSignInData] = useState<LoginBody>({
        user_name: "",
        password: "",
    });
    const [passwordReset, updatePasswordResetData] = useState<ForgotPassword>({
        user_name: "",
        email: "",
    });
    const [loadUserLogin, updateLoadUserLogin] = useState(false);


    useEffect(() => {
        sessionStorage.clear()
        document.body.setAttribute("app-data-theme", "light");
        document.body.setAttribute("data-bs-theme", "light");
    }, [])

    /**
     * The function `setPasswordFieldView` toggles the visibility of a password field between plain
     * text and password input.
     */
    function setPasswordFieldView() {
        if (passwordFieldType === "password") {
            updatePasswordFieldType("text")
        } else {
            updatePasswordFieldType("password")
        }
    }

    /**
     * The function `setPageViewType` updates page view based on the selected type and handles specific
     * data updates for "login" and "forgotPassword" views.
     * @param {PageView} selected - The `selected` parameter in the `setPageViewType` function is of
     * type `PageView`. It is used to determine which page view is currently selected, such as "login"
     * or "forgotPassword".
     */
    function setPageViewType(selected: PageView) {
        updatePageView(selected);
        updateLoadUserLogin(false)
        if (selected === "login") {
            updateSignInData({ password: "", user_name: passwordReset.user_name ? passwordReset.user_name : "" });
        } else if (selected === "forgotPassword") {
            updatePasswordResetData({ user_name: signInData.user_name ? signInData.user_name : "", email: "" });
        }
    }

    /**
     * The function `openSignUp` navigates to the sign-up page using the `navigate` function with the
     * URL from `ROUTER_KEYS.sign_up.url`.
     */
    function openSignUp() {
        navigate(ROUTER_KEYS.sign_up.url)
    }

    /**
     * The function `verifyUser` handles user authentication by logging in with provided credentials
     * and storing user data in session storage.
     * @param {any} e - The parameter `e` in the `verifyUser` function is typically an event object,
     * commonly used in event handlers in JavaScript. It is used to access information about the event
     * that triggered the function, such as a form submission or a button click. In this case, it is
     * being used to prevent
     * @returns The function `verifyUser` returns either nothing (undefined) if the condition for
     * filling the Username and Password is not met, or it navigates to the dashboard URL after
     * successfully logging in the user.
     */
    function verifyUser(e: any) {
        clearErrorMessage()
        e.preventDefault();
        if (!signInData.user_name || !signInData.password) {
            toast.error("Fill the Username and Password", { id: "fields-empty", duration: 2000 });
            return;
        }
        updateLoadUserLogin(true)
        userApiService.login(signInData).then(res => {
            const data = res.data.data
            sessionStorage.setItem("user_alias", data.name);
            sessionStorage.setItem("user_email", data.email);
            sessionStorage.setItem("currency_id", data.currency_id);
            sessionStorage.setItem("currency_code", data.currency_code);
            sessionStorage.setItem("currency_name", data.currency_name);
            sessionStorage.setItem("currency_name_plural", data.currency_name_plural);
            sessionStorage.setItem("currency_decimal_digits", data.currency_decimal_digits ?? 2);
            sessionStorage.setItem("last_login", data.last_login ? data.last_login : "");
            sessionStorage.setItem("time_zone_id", data.time_zone_id);
            sessionStorage.setItem("time_zone", data.time_zone ? data.time_zone : "");
            sessionStorage.setItem("access_token", data.token ? data.token : "");
            sessionStorage.setItem("app_theme", data.theme ? data.theme : "system")
            navigate(ROUTER_KEYS.dashboard.url)
        }).catch(e => {
            const msg = e?.response?.data?.message ?? "Login Failed";
            updateErrorMessage(msg);
            updateLoadUserLogin(false)
        })
    }

    /**
     * The function `sendForgetPasswordLink` is used to send a password reset link to a user's
     * registered email after validating the username and email fields.
     * @param {any} e - The parameter `e` in the `sendForgetPasswordLink` function is typically an
     * event object, which is commonly used in event handling functions in JavaScript. In this case, it
     * is likely representing an event that triggers the function, such as a form submission or a
     * button click. The `e.preventDefault
     * @returns The function `sendForgetPasswordLink` returns either nothing (undefined) or it returns
     * early with a toast error message if the `user_name` or `email` fields are empty. If the password
     * reset is successful, it displays a success toast message and sets the page view type to "login".
     * If there is an error during the password reset process, it updates the error message and sets
     * `update
     */
    function sendForgetPasswordLink(e: any) {
        e.preventDefault();
        clearErrorMessage()
        if (!passwordReset.user_name || !passwordReset.email) {
            toast.error("Fill the Username and Email", { id: "fields-empty-password-link", duration: 2000 });
            return;
        }
        updateLoadUserLogin(true)
        userApiService.resetPassword(passwordReset).then(() => {
            toast.success("Reset password link sent to your registered mail", { duration: 5000 });
            setPageViewType("login")
        }).catch(e => {
            const msg = e?.response?.data?.message ?? "Failed to generate link";
            updateErrorMessage(msg);
            updateLoadUserLogin(false)
        })
    }

    /**
     * The function `clearErrorMessage` clears the error message by updating it to an empty string.
     */
    function clearErrorMessage() {
        updateErrorMessage("")
    }

    return (
        <>
            <div className="auth-page">
                <div className="auth-container">
                    <div className="logo-container">
                        <img src={appLogo} alt="" />
                    </div>
                    {
                        pageViewType === "login" &&
                        <div className="form-container">
                            <div className="form-data">
                                <form onSubmit={verifyUser}>
                                    <div className="form-group mb-3">
                                        <label htmlFor="username" className="field-required">Username</label>
                                        <input type="text" className="form-control" name="username" id="username" value={signInData.user_name} disabled={loadUserLogin} onChange={(e) => {
                                            clearErrorMessage()
                                            updateSignInData({
                                                ...signInData,
                                                user_name: e.target.value
                                            })
                                        }} />
                                    </div>
                                    <div className="form-group mb-3">
                                        <label htmlFor="password" className="field-required">Password</label>
                                        <input type={passwordFieldType} className="form-control" name="password" id="password" disabled={loadUserLogin} onChange={(e) => {
                                            clearErrorMessage()
                                            updateSignInData({
                                                ...signInData,
                                                password: e.target.value
                                            })
                                        }} />
                                        <span className="password-view" id="password-view" >
                                            {
                                                passwordFieldType === "password" && <i className="fa fa-eye" onClick={setPasswordFieldView}></i>
                                            }
                                            {
                                                passwordFieldType === "text" && <i className="fa fa-eye-slash" onClick={setPasswordFieldView}></i>
                                            }
                                        </span>
                                    </div>
                                    {
                                        errorMessage &&
                                        <div className="form-error">
                                            {errorMessage}
                                        </div>
                                    }
                                    <div className="form-btn">
                                        {
                                            loadUserLogin ?
                                                <button className="btn btn-ft-primary w-100" type="button" disabled>
                                                    <span className="spinner-border spinner-border-sm" aria-hidden="true"></span> Authenticating...
                                                </button>
                                                :
                                                <button className="btn btn-ft-primary w-100" type="submit">Sign In</button>
                                        }

                                    </div>
                                </form>
                            </div>
                            <div className="form-options">
                                <div className="option" >
                                    <div className={`link-text ${loadUserLogin ? " disabled-block" : ""}`} onClick={() => setPageViewType("forgotPassword")}>Forgot Password?</div>
                                </div>
                                <div className="option">
                                    New to Finex? <div className={`link-text ${loadUserLogin ? " disabled-block" : ""}`} onClick={openSignUp}>Sign up</div>
                                </div>
                            </div>
                        </div>
                    }
                    {
                        pageViewType === "forgotPassword" &&
                        <div className="form-container">
                            <div className="form-data">
                                <form onSubmit={sendForgetPasswordLink}>
                                    <div className="form-group mb-3">
                                        <label htmlFor="user-name" className="field-required">Username</label>
                                        <input type="text" className="form-control" name="user-name" id="user-name" value={passwordReset.user_name} disabled={loadUserLogin} onChange={(e) => {
                                            clearErrorMessage()
                                            updatePasswordResetData({
                                                ...passwordReset,
                                                user_name: e.target.value
                                            })
                                        }} />
                                    </div>
                                    <div className="form-group mb-3">
                                        <label htmlFor="user-mail" className="field-required">Email</label>
                                        <input type="email" className="form-control" name="user-mail" id="user-mail" disabled={loadUserLogin} onChange={(e) => {
                                            clearErrorMessage()
                                            updatePasswordResetData({
                                                ...passwordReset,
                                                email: e.target.value
                                            })
                                        }} />
                                    </div>
                                    {
                                        errorMessage &&
                                        <div className="form-error">
                                            {errorMessage}
                                        </div>
                                    }
                                    <div className="form-btn">
                                        {
                                            loadUserLogin ?
                                                <button className="btn btn-ft-primary w-100" type="button" disabled>
                                                    <span className="spinner-border spinner-border-sm" aria-hidden="true"></span> Generating...
                                                </button>
                                                :
                                                <button className="btn btn-ft-primary w-100" type="submit">Send Link</button>
                                        }
                                    </div>
                                </form>
                            </div>
                            <div className="form-options">
                                <div className="option">
                                    <div className={`link-text ${loadUserLogin ? " disabled-block" : ""}`} onClick={() => setPageViewType("login")}>Back to login</div>
                                </div>
                                <div className="option">
                                    New to Finex? <div className={`link-text ${loadUserLogin ? " disabled-block" : ""}`} onClick={openSignUp}>Sign up</div>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </>
    )
}