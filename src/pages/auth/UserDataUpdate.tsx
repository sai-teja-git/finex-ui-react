import { useEffect, useState } from "react";

export default function UserDataUpdate() {
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

    return (
        <>
            <div className="auth-page">
                <div className="auth-container ">
                    <div className="logo-container">
                        <img src="src/assets/images/logos/finex-logo-dark.png" alt="" />
                    </div>
                    <div className="form-container">
                        <div className="form-title">
                            Verify Account
                        </div>
                        <div className="form-data">
                            <form >
                                <div className="form-group mb-3">
                                    <label htmlFor="user-password-new" className="field-required">Password</label>
                                    <input type={passwordFieldType} className="form-control" name="user-password-new" id="user-password-new" />
                                    <span className="password-view" id="password-view" >
                                        {
                                            passwordFieldType === "password" && <i className="fa fa-eye" onClick={setPasswordFieldView}></i>
                                        }
                                        {
                                            passwordFieldType === "text" && <i className="fa fa-eye-slash" onClick={setPasswordFieldView}></i>
                                        }
                                    </span>
                                </div>
                                <div className="form-group mb-3">
                                    <label htmlFor="user-password-confirm" className="field-required">Confirm Password</label>
                                    <input type={passwordFieldType} className="form-control" name="user-password-confirm" id="user-password-confirm" />
                                    <span className="password-view" id="password-view" >
                                        {
                                            passwordFieldType === "password" && <i className="fa fa-eye" onClick={setPasswordFieldView}></i>
                                        }
                                        {
                                            passwordFieldType === "text" && <i className="fa fa-eye-slash" onClick={setPasswordFieldView}></i>
                                        }
                                    </span>
                                </div>
                                <div className="form-group mb-3">
                                    <label className="field-required" htmlFor="user-time-zone">Timezone</label>
                                    <div className="dropdown fnx-dropdown">
                                        <a className="btn btn-outline-secondary w-100 dropdown-toggle" id="user-time-zone" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            Select Timezone
                                        </a>
                                        <ul className="dropdown-menu">
                                            <div className="field-search">
                                                <input type="text" className="form-control" name="search-text" id="search-text" placeholder="Search Here" />
                                            </div>
                                            <div className="field-data">

                                                {
                                                    Array(10).fill(0).map((_e, i) => (
                                                        <li key={i}><a className={`dropdown-item ${i === 2 ? "active" : ""}`} >zone-{i + 1}</a></li>
                                                    ))
                                                }
                                            </div>
                                        </ul>
                                    </div>
                                </div>
                                <div className="form-group mb-3">
                                    <label className="field-required" htmlFor="user-currency">Currency</label>
                                    <div className="dropdown fnx-dropdown">
                                        <a className="btn btn-outline-secondary w-100 dropdown-toggle" id="user-currency" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            Select Currency
                                        </a>
                                        <ul className="dropdown-menu">
                                            <div className="field-search">
                                                <input type="text" className="form-control" name="search-text" id="search-text" placeholder="Search Here" />
                                            </div>
                                            <div className="field-data">
                                                {
                                                    Array(10).fill(0).map((_e, i) => (
                                                        <li key={i}><a className={`dropdown-item ${i === 2 ? "active" : ""}`} >Currency-{i + 1}</a></li>
                                                    ))
                                                }
                                            </div>
                                        </ul>
                                    </div>
                                </div>
                                <div className="form-btn">
                                    <button className="btn btn-ft-primary w-100" type="submit">Update</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
