import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { USER_CONST } from "../../const-files/user.const";
import toast from "react-hot-toast";
import userApiService from "../../api/user.api.service";

import appLogo from "../../assets/images/logos/finex-logo-dark.png"

interface PasswordData {
    password: string;
    confirm_password: string;
}

export default function UserVerification() {

    /* The `const pageWaitSec = 4` line is declaring a constant variable named `pageWaitSec` and
    assigning it a value of `4`. This variable is used to store the number of seconds for a page
    close countdown in the `UserVerification` component. It is used to determine how long the page
    will wait before closing automatically after a certain action is completed. */
    const pageWaitSec = 4;

    const [passwordView, updatePasswordView] = useState<"text" | "password">("password");
    const [confirmPasswordView, updateConfirmPasswordView] = useState<"text" | "password">("password");
    const [searchParams] = useSearchParams();
    const [pageType, updatePageType] = useState("");
    const [loadVerification, updateLoadVerification] = useState(false);
    const [errorMessage, updateErrorMessage] = useState("")
    const [passwordData, updatePasswordData] = useState<PasswordData>({
        password: "",
        confirm_password: ""
    })
    const [apiUpdate, updateApiFlag] = useState(false);
    const [pageCloseCountDown, updatePageCloseCountDown] = useState(pageWaitSec);

    useEffect(() => {
        sessionStorage.clear()
        document.body.setAttribute("app-data-theme", "light");
        document.body.setAttribute("data-bs-theme", "light");
        const verification = searchParams.get("verification")
        updatePageType(verification ?? "")
    }, [])

    /**
     * The function `clearErrorMessage` clears the error message by updating it to an empty string.
     */
    function clearErrorMessage() {
        updateErrorMessage("")
    }

    /**
     * The function `updateData` validates password data, sends verification or password update
     * requests based on the page type, and handles success or error responses accordingly.
     * @returns The `updateData` function returns nothing explicitly. If the code execution completes
     * without any errors, it will implicitly return `undefined`.
     */
    function updateData() {
        try {
            if (passwordData.password !== passwordData.confirm_password) {
                toast.error("Password and Confirm Password does not match.", { duration: 3000, id: "password-not-match" })
                updateErrorMessage("Password and Confirm Password does not match.")
                throw new Error("Invalid Password")
            }
            const PASSWORD_REGEX = new RegExp(USER_CONST["PASSWORD_REGEX"])
            if (!PASSWORD_REGEX.test(passwordData.password)) {
                toast.error("Password does not match with the constraints.", { duration: 3000, id: "invalid-password-constraints" })
                updateErrorMessage("Password does not match with the constraints.")
                throw new Error("Invalid Password")
            }
        } catch {
            return
        }
        const code = searchParams.get("code")
        const body = {
            password: passwordData.password,
            code,
            verification: pageType
        }
        updateLoadVerification(true)
        if (pageType === "email") {
            userApiService.verifyUser(body).then(() => {
                startPageCloseCountDown();
                updateApiFlag(true);
                toast.success("User Verified", { duration: 3000 });
            }).catch(e => {
                const msg = e?.response?.data?.message ?? "Verification Failed";
                toast.error(msg, { duration: 3000 });
                startPageCloseCountDown();
                updateApiFlag(true);
            })
        } else if (pageType === "password") {
            userApiService.overridePassword(body).then(() => {
                startPageCloseCountDown();
                updateApiFlag(true);
                toast.success("Password updated", { duration: 3000 });
            }).catch(e => {
                const msg = e?.response?.data?.message ?? "Update Failed";
                toast.error(msg, { duration: 3000 });
                startPageCloseCountDown();
                updateApiFlag(true);
            })
        } else {
            toast.error("Invalid Link", { duration: 3000 });
            startPageCloseCountDown();
            updateApiFlag(true);
        }
    }

    useEffect(() => {
        if (pageCloseCountDown < pageWaitSec) {
            startPageCloseCountDown()
        }
    }, [pageCloseCountDown])

    /**
     * The function `startPageCloseCountDown` initiates a countdown timer that closes the window after
     * a specified time if a condition is met.
     */
    function startPageCloseCountDown() {
        setTimeout(() => {
            if (pageCloseCountDown <= 1) {
                window.close()
            } else {
                const newValue = pageCloseCountDown - 1
                updatePageCloseCountDown(newValue)
            }
        }, 1000)
    }

    return (
        <>
            <div className="auth-page">
                <div className="auth-container ">
                    <div className="logo-container">
                        <img src={appLogo} alt="" />
                    </div>
                    <div className="form-container">
                        <div className="form-title">
                            {pageType === "email" ? "Verify Account & set password" : "Update Password"}
                        </div>
                        <div className="form-data">
                            <form>
                                <div className="form-group mb-3">
                                    <label htmlFor="user-password-new" className="field-required">Password</label>
                                    <input type={passwordView} className="form-control" name="user-password-new" id="user-password-new" disabled={loadVerification} onChange={(e) => {
                                        updatePasswordData({
                                            ...passwordData,
                                            password: e.target.value
                                        })
                                        clearErrorMessage();
                                    }} />
                                    <span className="password-view" id="password-view" >
                                        {
                                            passwordView === "password" && <i className="fa fa-eye" onClick={() => updatePasswordView("text")}></i>
                                        }
                                        {
                                            passwordView === "text" && <i className="fa fa-eye-slash" onClick={() => updatePasswordView("password")}></i>
                                        }
                                    </span>
                                </div>
                                <div className="form-group mb-3">
                                    <label htmlFor="user-password-confirm" className="field-required">Confirm Password</label>
                                    <input type={confirmPasswordView} className="form-control" name="user-password-confirm" id="user-password-confirm" disabled={loadVerification} onChange={(e) => {
                                        updatePasswordData({
                                            ...passwordData,
                                            confirm_password: e.target.value
                                        })
                                        clearErrorMessage();
                                    }} />
                                    <span className="password-view" id="password-view" >
                                        {
                                            confirmPasswordView === "password" && <i className="fa fa-eye" onClick={() => updateConfirmPasswordView("text")}></i>
                                        }
                                        {
                                            confirmPasswordView === "text" && <i className="fa fa-eye-slash" onClick={() => updateConfirmPasswordView("password")}></i>
                                        }
                                    </span>
                                </div>
                                {
                                    errorMessage &&
                                    <div className="form-error">
                                        {errorMessage}
                                    </div>
                                }
                                {
                                    !apiUpdate ?
                                        <div className="form-btn">
                                            {
                                                loadVerification ?
                                                    <button className="btn btn-ft-primary w-100" type="button" disabled>
                                                        <span className="spinner-border spinner-border-sm" aria-hidden="true"></span> {pageType === "email" ? "Verifying...." : "Updating..."}
                                                    </button>
                                                    :
                                                    <button className="btn btn-ft-primary w-100" type="button" onClick={updateData}>{pageType === "email" ? "Verify" : "Update"}</button>
                                            }
                                        </div>
                                        :
                                        <div className="info-msg">
                                            {
                                                pageType === "email" ?
                                                    <div>User Verified, Page will close in {pageCloseCountDown}</div>
                                                    :
                                                    <div>Password Updated, Page will close in {pageCloseCountDown}</div>
                                            }
                                        </div>
                                }
                            </form>
                        </div>
                        {
                            !apiUpdate &&
                            <div className="form-options">
                                <div className="option">
                                    Have trouble with setting password?<div className={`link-text ${loadVerification ? " disabled-block" : ""}`} data-bs-toggle="offcanvas" data-bs-target="#passwordConstraints">View Constraints</div>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>

            <div className="offcanvas offcanvas-end" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} id="passwordConstraints" aria-labelledby="staticBackdropLabel">
                <div className="offcanvas-header border-bottom">
                    <div className="title">
                        Password Constraints
                    </div>
                    <div className="options">
                        <div className="option-item close">
                            <i className="fa-solid fa-xmark" data-bs-dismiss="offcanvas"></i>
                        </div>
                    </div>
                </div>
                <div className="offcanvas-body">
                    <ul>
                        <li>Should Contain One Capital Letter</li>
                        <li>Should Contain One small Letter</li>
                        <li>Should Contain One of the Special character (@,$,!,%,*,&,?)</li>
                        <li>Should Contain length of min 6 and max 24 characters</li>
                    </ul>
                </div>
                <div className="offcanvas-footer end">
                    <div className="option">
                        <button className="btn btn-outline-secondary" data-bs-dismiss="offcanvas"><i className="fa-regular fa-circle-xmark"></i> Close</button>
                    </div>
                </div>
            </div>
        </>
    )
}
