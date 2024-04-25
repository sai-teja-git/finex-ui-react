import { useEffect } from "react";
import { useNavigate } from "react-router-dom"
import { ROUTER_KEYS } from "../../router/router-keys";

export default function SignUp() {
    const navigate = useNavigate();

    useEffect(() => {
        sessionStorage.clear()
        document.body.setAttribute("app-data-theme", "light");
        document.body.setAttribute("data-bs-theme", "light");
    }, [])

    function openLogin() {
        navigate(ROUTER_KEYS.login.url)
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
                            <form >
                                <div className="form-group mb-3">
                                    <label htmlFor="user-name" className="field-required">User Name</label>
                                    <input type="text" className="form-control" name="user-name" id="user-name" />
                                </div>
                                <div className="form-group mb-3">
                                    <label htmlFor="user-display-name" className="field-required">Name</label>
                                    <input type="text" className="form-control" name="user-display-name" id="user-display-name" />
                                </div>
                                <div className="form-group mb-3">
                                    <label htmlFor="user-mail" className="field-required">Mail</label>
                                    <input type="email" className="form-control" name="user-mail" id="user-mail" />
                                </div>
                                <div className="form-btn">
                                    <button className="btn btn-ft-primary w-100" type="submit">Sign Up</button>
                                </div>
                            </form>
                        </div>
                        <div className="form-options">
                            <div className="option"></div>
                            <div className="option" onClick={openLogin}>
                                Sign In
                            </div>
                            {/* <div className="option" onClick={() => setPageViewType("login")}>
                                Back to login
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
