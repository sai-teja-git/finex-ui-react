import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import userApiService from "../api/user.api.service";
import commonApiService from "../api/common.api.service";
import { ROUTER_KEYS } from "../router/router-keys";
import timeConversionsService from "../services/timeConversionsService";
import toast from "react-hot-toast";
import { USER_CONST } from "../const-files/user.const";
import globalRouter from "../services/globalRouter";

interface PasswordUpdate {
    current_password: string;
    password: string;
    confirm_password: string;
}

interface UserDataUpdate {
    name: string;
    email: string;
    currency: Record<string, any>;
    timezone: Record<string, any>;
}

export default function Header() {
    const navigate = useNavigate();
    const [pageTheme, setPageTheme] = useState("");
    const [userDisplayData, updateUserDisplayData] = useState<any>({});
    const [allTimeZones, updateAllTimeZonesData] = useState<any[]>([])
    const [allCurrency, updateAllCurrencyData] = useState<any[]>([])

    const [passwordData, updatePasswordData] = useState<PasswordUpdate>({
        current_password: "",
        password: "",
        confirm_password: ""
    })
    const [passwordView, updatePasswordView] = useState<"text" | "password">("password");
    const [confirmPasswordView, updateConfirmPasswordView] = useState<"text" | "password">("password");
    const [loadPasswordUpdate, updatePasswordLoaderFlag] = useState(false);

    const [userDataToEdit, updateUserEditedData] = useState<UserDataUpdate>({
        name: "",
        email: "",
        currency: {},
        timezone: {}
    });
    const [loadUserUpdate, updateUserDataLoaderFlag] = useState(false);
    const [errorMessage, updateErrorMessage] = useState("")

    useEffect(() => {
        updateTheme();
        const userData = {
            name: sessionStorage.getItem("user_alias"),
            email: sessionStorage.getItem("user_email"),
            timezone: sessionStorage.getItem("time_zone"),
            currency_name: sessionStorage.getItem("currency_name_plural"),
            last_login: timeConversionsService.convertUtcDateTimeToLocal(sessionStorage.getItem("last_login") as string, "DD-MM-YYYY HH:mm:ss") as string,
        }
        updateUserDisplayData({ ...userData });
        getAllTimeZones();
        getAllCurrency();
        try {
            window.matchMedia("(prefers-color-scheme: dark)").addEventListener('change', () => {
                updateTheme()
            })
        } catch { }
    }, [])

    function getAllTimeZones() {
        commonApiService.getAllTimeZones().then(res => {
            updateAllTimeZonesData(res?.data?.data ?? [])
        }).catch(() => {
            updateAllTimeZonesData([])
        })
    }

    function getAllCurrency() {
        commonApiService.getAllCurrency().then(res => {
            updateAllCurrencyData(res?.data?.data ?? [])
        }).catch(() => {
            updateAllCurrencyData([])
        })
    }

    /**
     * The function `selectTheme` updates the selected theme and stores it in the session storage.
     * @param {string} selected - The `selected` parameter is a string that represents the theme that
     * the user has selected.
     */
    function selectTheme(selected: string) {
        updateTheme(selected)
        sessionStorage.setItem("app_theme", selected)
        const body = {
            theme: selected
        }
        userApiService.updateUserDetails(body)
    }

    /**
     * The function updates the theme of the application based on the user's preference or the system's
     * preferred color scheme.
     * @param theme - The `theme` parameter is a string that represents the current theme of the
     * application. It can have three possible values: "dark", "light", or "system".
     */
    function updateTheme(theme = sessionStorage.getItem("app_theme")) {
        if (!theme) {
            theme = "dark";
            sessionStorage.setItem("app_theme", "dark");
        }
        setPageTheme(theme)
        if (theme === "system") {
            if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
                theme = "dark"
            } else {
                theme = "light"
            }
        }
        if (theme === "dark") {
            document.body.setAttribute("app-data-theme", "dark");
            document.body.setAttribute("data-bs-theme", "dark");
        } else {
            document.body.setAttribute("app-data-theme", "light");
            document.body.setAttribute("data-bs-theme", "light");
        }
    }

    /**
     * The function toggles the "menu-open" class on the ".page-wrapper" element.
     */
    function toggleMenu() {
        if ($(".page-wrapper").hasClass("menu-open")) {
            $(".page-wrapper").removeClass("menu-open")
        } else {
            $(".page-wrapper").addClass("menu-open")
        }
    }

    function openUserDetailsEdit() {
        updateUserEditedData({
            name: userDisplayData.name,
            email: userDisplayData.email,
            currency: {
                _id: sessionStorage.getItem("currency_id"),
                name: sessionStorage.getItem("currency_name")
            },
            timezone: {
                _id: sessionStorage.getItem("time_zone_id"),
                zone: sessionStorage.getItem("time_zone")
            }
        })
        $("#userDataUpdatePage").offcanvas("show");
        $("#profileDetails").offcanvas("hide");
    }

    function openUserPasswordEdit() {
        updateErrorMessage("")
        updatePasswordData({
            current_password: "",
            password: "",
            confirm_password: ""
        })
        $("#userPasswordUpdatePage").offcanvas("show");
        $("#profileDetails").offcanvas("hide");
    }

    function updateUserPassword() {
        try {
            updateErrorMessage("")
            for (const key in passwordData) {
                if (!passwordData[key as keyof PasswordUpdate]) {
                    toast.error("Please fill required fields")
                    throw new Error("Missing fields")
                }
            }
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
        const body = {
            old_password: passwordData.current_password,
            new_password: passwordData.password
        }
        updatePasswordLoaderFlag(true)
        userApiService.updateUserPassword(body).then(() => {
            updatePasswordLoaderFlag(false);
            toast.success("Password Updated", { duration: 3000 });
            if (globalRouter.navigate) {
                globalRouter.navigate(ROUTER_KEYS.login.url);
            }
        }).catch(e => {
            const msg = e?.response?.data?.message ?? "Update Failed";
            toast.error(msg, { duration: 3000 });
            updateErrorMessage(msg)
            updatePasswordLoaderFlag(false);
        })
    }

    function updateUserData() { }

    function logout() {
        navigate(ROUTER_KEYS.login.url)
    }

    return (
        <>
            <div className="app-header">
                <div className="head-left">
                    <div className="logo">
                        <div className="logo-image"></div>
                    </div>
                    <div className="menu left">
                        <i className="fa-solid fa-bars" onClick={toggleMenu}></i>
                    </div>
                </div>
                <div className="head-right">
                    <div className="head-option menu">
                        <div className="menu">
                            <i className="fa-solid fa-bars" onClick={toggleMenu}></i>
                        </div>
                    </div>
                    <div className="head-option">
                        <div className="user-profile">
                            <img src="/src/assets/images/profile/default-profile-image.png" alt="" data-bs-toggle="offcanvas" data-bs-target="#profileDetails" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="offcanvas offcanvas-end" data-bs-backdrop="static" tabIndex={-1} id="profileDetails" aria-labelledby="staticBackdropLabel">
                <div className="offcanvas-header">
                    <div className="title">
                        <div className="logout-option" onClick={logout}>
                            <i className="fa-solid fa-power-off"></i> Logout
                        </div>
                    </div>
                    <div className="options">
                        <div className="option-item close">
                            <i className="fa-solid fa-xmark" data-bs-dismiss="offcanvas"></i>
                        </div>
                    </div>
                </div>
                <div className="offcanvas-body p-0">
                    <div className="profile-data">
                        <div className="profile-image">
                            <img src="/src/assets/images/profile/default-profile-image.png" alt="logo" />
                        </div>
                        <div className="user-name">user_name</div>
                    </div>
                    <div className="theme-action">
                        <div className="title">
                            Theme
                        </div>
                        <div className="theme-options">
                            <div className={`switch-theme light ${pageTheme === "light" && "active"}`} onClick={() => selectTheme("light")}>
                                Light
                            </div>
                            <div className={`switch-theme dark ${pageTheme === "dark" && "active"}`} onClick={() => selectTheme("dark")}>
                                <i className="fa-solid fa-cloud-moon"></i> Dark
                            </div>
                            <div className={`switch-theme system ${pageTheme === "system" && "active"}`} onClick={() => selectTheme("system")}>
                                <i className="fa-solid fa-desktop"></i> System
                            </div>
                        </div>
                    </div>
                    <div className="profile-details">
                        <div className="profile-item">
                            <div className="details editable">
                                <div className="title">
                                    <i className="fa-solid fa-user"></i>
                                    Name
                                </div>
                                <div className="value">
                                    <div>{userDisplayData?.name ?? "----"}</div>
                                    <div className="edit-menu">
                                        <i className="fa-solid fa-pen-to-square" onClick={openUserDetailsEdit}></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="profile-item">
                            <div className="details editable">
                                <div className="title">
                                    <i className="fa-solid fa-key"></i>
                                    Password
                                </div>
                                <div className="value">
                                    <div>************</div>
                                    <div className="edit-menu">
                                        <i className="fa-solid fa-pen-to-square" onClick={openUserPasswordEdit}></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="profile-item">
                            <div className="details editable">
                                <div className="title">
                                    <i className="fa-solid fa-envelope"></i>
                                    Mail
                                </div>
                                <div className="value">
                                    <div>{userDisplayData?.email ?? "----"}</div>
                                    <div className="edit-menu">
                                        <i className="fa-solid fa-pen-to-square" onClick={openUserDetailsEdit}></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="profile-item">
                            <div className="details editable">
                                <div className="title">
                                    <i className="fa-solid fa-coins"></i>
                                    Currency
                                </div>
                                <div className="value">
                                    <div>{userDisplayData?.currency_name ?? "----"}</div>
                                    <div className="edit-menu">
                                        <i className="fa-solid fa-pen-to-square" onClick={openUserDetailsEdit}></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="profile-item">
                            <div className="details editable">
                                <div className="title">
                                    <i className="fa-solid fa-globe"></i>
                                    Time Zone
                                </div>
                                <div className="value">
                                    <div>{userDisplayData?.timezone ?? "----"}</div>
                                    <div className="edit-menu">
                                        <i className="fa-solid fa-pen-to-square" onClick={openUserDetailsEdit}></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="profile-item">
                            <div className="details">
                                <div className="title">
                                    <i className="fa-solid fa-clock"></i>
                                    Last Login
                                </div>
                                <div className="value">
                                    <div>
                                        {userDisplayData?.last_login ? userDisplayData.last_login as string : "---"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="offcanvas offcanvas-end" data-bs-backdrop="static" tabIndex={-1} id="userDataUpdatePage" aria-labelledby="staticBackdropLabel">
                <div className="offcanvas-header border-bottom">
                    <div className="title">
                        Update User Details
                    </div>
                    <div className="options">
                        <div className={`option-item close ${loadUserUpdate ? "disabled-block" : ""}`}>
                            <i className="fa-solid fa-xmark" data-bs-toggle="offcanvas" data-bs-target="#profileDetails"></i>
                        </div>
                    </div>
                </div>
                <div className="offcanvas-body">
                    <div className="row">
                        <form autoComplete="false">
                            <div className="col-12 form-group mb-3">
                                <label className="field-required" htmlFor="user-full-name">name</label>
                                <input type="text" id="user-full-name" name="user-full-name" className="form-control" value={userDataToEdit.name} disabled={loadUserUpdate}
                                    onChange={(e) => {
                                        updateUserEditedData({
                                            ...userDataToEdit,
                                            name: e.target.value
                                        })
                                    }} />
                            </div>
                            <div className="col-12 form-group mb-3">
                                <label className="field-required" htmlFor="user-mail">Mail</label>
                                <input type="text" id="user-mail" name="user-mail" className="form-control" value={userDataToEdit.email} disabled={loadUserUpdate}
                                    onChange={(e) => {
                                        updateUserEditedData({
                                            ...userDataToEdit,
                                            email: e.target.value
                                        })
                                    }} />
                            </div>
                            <div className="col-12 form-group mb-3">
                                <label className="field-required" >Currency</label>
                                <div className="dropdown fnx-dropdown">
                                    <a className="btn btn-outline-secondary w-100 dropdown-toggle" id="user-currency" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        {userDataToEdit.currency?.name ? userDataToEdit.currency.name : "Select Currency"}
                                    </a>
                                    <ul className="dropdown-menu">
                                        <div className="field-search">
                                            <input type="text" className="form-control" name="currency-search-text" id="currency-search-text" placeholder="Search Here" />
                                        </div>
                                        <div className="field-data">

                                            {
                                                allCurrency.map((e) => (
                                                    <li key={e._id}><a className={`dropdown-item ${userDataToEdit.currency?._id === e._id ? "active" : ""}`} >{e.name}</a></li>
                                                ))
                                            }
                                        </div>
                                    </ul>
                                </div>
                            </div>
                            <div className="col-12 form-group mb-3">
                                <label className="field-required" >Time Zone</label>
                                <div className="dropdown fnx-dropdown">
                                    <a className="btn btn-outline-secondary w-100 dropdown-toggle" id="user-time-zone" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        {userDataToEdit.timezone?.zone ? userDataToEdit.timezone.zone : "Select Time Zone"}
                                    </a>
                                    <ul className="dropdown-menu">
                                        <div className="field-search">
                                            <input type="text" className="form-control" name="zone-search-text" id="zone-search-text" placeholder="Search Here" />
                                        </div>
                                        <div className="field-data">

                                            {
                                                allTimeZones.map((e) => (
                                                    <li key={e._id}><a className={`dropdown-item ${userDataToEdit.timezone?._id === e._id ? "active" : ""}`} >{e.zone}</a></li>
                                                ))
                                            }
                                        </div>
                                    </ul>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="offcanvas-footer end">
                    <div className="option">
                        <button className="btn btn-outline-secondary" data-bs-toggle="offcanvas" data-bs-target="#profileDetails" disabled={loadPasswordUpdate}><i className="fa-regular fa-circle-xmark"></i> Close</button>
                    </div>
                    <div className="option">
                        <button className="btn btn-success" disabled={loadUserUpdate} onClick={updateUserData}>
                            {
                                loadUserUpdate ?
                                    <><span className="spinner-border spinner-border-sm" aria-hidden="true"></span> Updating...</>
                                    :
                                    <>
                                        <i className="fa-regular fa-circle-check"></i> Submit
                                    </>
                            }
                        </button>
                    </div>
                </div>
            </div>

            <div className="offcanvas offcanvas-end" data-bs-backdrop="static" tabIndex={-1} id="userPasswordUpdatePage" aria-labelledby="staticBackdropLabel">
                <div className="offcanvas-header border-bottom">
                    <div className="title">
                        Update Password
                    </div>
                    <div className="options">
                        <div className={`option-item close ${loadPasswordUpdate ? "disabled-block" : ""}`}>
                            <i className="fa-solid fa-xmark" data-bs-toggle="offcanvas" data-bs-target="#profileDetails"></i>
                        </div>
                    </div>
                </div>
                <div className="offcanvas-body">
                    <div className="row update-password">
                        <form autoComplete="off">
                            <div className="col-12 form-group mb-3">
                                <label className="field-required" htmlFor="user-name">Current Password</label>
                                <input type="password" id="user-name" name="user-name" className="form-control" value={passwordData.current_password} disabled={loadPasswordUpdate} onChange={(e) => {
                                    updatePasswordData({
                                        ...passwordData,
                                        current_password: e.target.value
                                    })
                                    updateErrorMessage("")
                                }} />
                            </div>
                            <div className="col-12 form-group mb-3">
                                <label htmlFor="user-password-new" className="field-required">New Password</label>
                                <input type={passwordView} className="form-control" name="user-password-new" id="user-password-new" value={passwordData.password} disabled={loadPasswordUpdate} onChange={(e) => {
                                    updatePasswordData({
                                        ...passwordData,
                                        password: e.target.value
                                    })
                                    updateErrorMessage("")
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
                            <div className="col-12 form-group mb-3">
                                <label htmlFor="user-password-confirm" className="field-required">Confirm Password</label>
                                <input type={confirmPasswordView} className="form-control" name="user-password-confirm" id="user-password-confirm" value={passwordData.confirm_password} disabled={loadPasswordUpdate} onChange={(e) => {
                                    updatePasswordData({
                                        ...passwordData,
                                        confirm_password: e.target.value
                                    })
                                    updateErrorMessage("")
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
                        </form>
                        {
                            errorMessage &&
                            <div className="form-error-message centered">
                                {errorMessage}
                            </div>
                        }
                        <div className="col-12 mt-3">
                            <h4>Password Constraints</h4>
                            <ul>
                                <li>Should Contain One Capital Letter</li>
                                <li>Should Contain One small Letter</li>
                                <li>Should Contain One of the Special character (@,$,!,%,*,&,?)</li>
                                <li>Should Contain length of min 6 and max 24 characters</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="offcanvas-footer end">
                    <div className="option">
                        <button className="btn btn-outline-secondary" data-bs-toggle="offcanvas" data-bs-target="#profileDetails" disabled={loadPasswordUpdate}><i className="fa-regular fa-circle-xmark"></i> Close</button>
                    </div>
                    <div className="option">
                        <button className="btn btn-success" disabled={loadPasswordUpdate} onClick={updateUserPassword}>
                            {
                                loadPasswordUpdate ?
                                    <><span className="spinner-border spinner-border-sm" aria-hidden="true"></span> Updating...</>
                                    :
                                    <>
                                        <i className="fa-regular fa-circle-check"></i> Submit
                                    </>
                            }
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
