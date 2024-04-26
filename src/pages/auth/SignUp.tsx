import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import { ROUTER_KEYS } from "../../router/router-keys";
import toast from "react-hot-toast";
import UserApiService from "../../api/user.api.service";


export default function SignUp() {
    const navigate = useNavigate();

    const [signUpData, updateSignUpData] = useState<Record<string, string>>({
        user_name: "",
        name: "",
        email: ""
    })
    const [loadUserSignUp, updateLoadUserSignUp] = useState(false)

    useEffect(() => {
        sessionStorage.clear()
        document.body.setAttribute("app-data-theme", "light");
        document.body.setAttribute("data-bs-theme", "light");
    }, [])

    function openLogin() {
        navigate(ROUTER_KEYS.login.url)
    }

    function createUser() {
        const required_fields = ["user_name", "name", "email"];
        for (let key of required_fields) {
            if (!signUpData[key]) {
                toast.error("Please Fill all required fields to Sign up", { duration: 3000, id: "sign-up-error" })
                return;
            }
        }
        const body = {
            zone_offset: new Date().getTimezoneOffset() * -1,
            ...signUpData
        }
        updateLoadUserSignUp(true)
        UserApiService.signUp(body).then(() => {
            toast.success("User Created\n Verification email sent to your registered mail, verify & create password to login", { duration: 6000 })
            // openLogin()
            updateLoadUserSignUp(false)
        }).catch(e => {
            updateLoadUserSignUp(false)
            const msg = e?.response?.data?.message ?? "User Creation Failed";
            toast.error(msg, { duration: 2000 })
            updateLoadUserSignUp(false)
        })
    }

    return (
        <>
            <div className="auth-page">
                <div className="auth-container auto-transform">
                    <div className="logo-container">
                        <img src="src/assets/images/logos/finex-logo-dark.png" alt="" />
                    </div>
                    <div className="form-container">
                        <div className="form-data">
                            <form autoComplete="off">
                                <div className="form-group mb-3">
                                    <label htmlFor="user-name" className="field-required">Username</label>
                                    <input type="text" className="form-control" name="user-name" id="user-name" placeholder="Enter User Name"
                                        onChange={(e) => updateSignUpData({ ...signUpData, user_name: e.target.value })} disabled={loadUserSignUp} />
                                </div>
                                <div className="form-group mb-3">
                                    <label htmlFor="user-display-name" className="field-required">Name</label>
                                    <input type="text" className="form-control" name="user-display-name" id="user-display-name" placeholder="Enter Full Name"
                                        onChange={(e) => updateSignUpData({ ...signUpData, name: e.target.value })} disabled={loadUserSignUp} />
                                </div>
                                <div className="form-group mb-3">
                                    <label htmlFor="user-mail" className="field-required">Email</label>
                                    <input type="email" className="form-control" name="user-mail" id="user-mail" placeholder="Enter Mail id"
                                        onChange={(e) => updateSignUpData({ ...signUpData, email: e.target.value })} disabled={loadUserSignUp} />
                                </div>
                                <div className="form-btn">
                                    {
                                        loadUserSignUp ?
                                            <button className="btn btn-ft-primary w-100" type="button" disabled>
                                                <span className="spinner-border spinner-border-sm" aria-hidden="true"></span> Creating...
                                            </button>
                                            :
                                            <button className="btn btn-ft-primary w-100" type="button" onClick={createUser}>Sign Up</button>
                                    }
                                </div>
                            </form>
                        </div>
                        <div className="form-options">
                            <div className="option"></div>
                            <div className="option" onClick={openLogin}>
                                Already have account?<div className={`link-text ${loadUserSignUp ? " disabled-block" : ""}`}>Sign In</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
