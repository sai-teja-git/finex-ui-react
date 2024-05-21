import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import userApiService from "../api/user.api.service";
import commonApiService from "../api/common.api.service";
import { ROUTER_KEYS } from "../router/router-keys";
import timeConversionsService from "../services/time-conversions.service";
import toast from "react-hot-toast";
import { USER_CONST } from "../const-files/user.const";
import globalRouter from "../services/globalRouter";
import helperService from "../services/helper-functions.service";
import CurrencyCode from "./CurrencyCode";
import NoData from "./NoData";
import userImage from "../../assets/images/profile/default-profile-image.png"

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
    const [allTimeZones, updateAllTimeZonesData] = useState<any[]>([]);
    const [filterTimeZones, updateFilterTimeZonesData] = useState<any[]>([]);
    const [allCurrency, updateAllCurrencyData] = useState<any[]>([]);
    const [filterCurrency, updateFilterCurrencyData] = useState<any[]>([]);

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
    const [currencySearch, updateCurrencySearchText] = useState("");
    const [zoneSearch, updateZoneSearchText] = useState("");
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
            updateFilterTimeZonesData(res?.data?.data ?? [])
        }).catch(() => {
            updateAllTimeZonesData([])
        })
    }

    function getAllCurrency() {
        commonApiService.getAllCurrency().then(res => {
            updateAllCurrencyData(res?.data?.data ?? [])
            updateFilterCurrencyData(res?.data?.data ?? [])
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
     * The function toggles the "menu-open" className on the ".page-wrapper" element.
     */
    function toggleMenu() {
        if ($(".page-wrapper").hasClass("menu-open")) {
            $(".page-wrapper").removeClass("menu-open")
        } else {
            $(".page-wrapper").addClass("menu-open")
        }
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
        updateCurrencySearchText("");
        updateZoneSearchText("");
        $("#userDataUpdatePage").offcanvas("show");
        $("#profileDetails").offcanvas("hide");
    }

    useEffect(() => {
        const data = helperService.filterArrayOnSearch(allCurrency, ["name"], currencySearch);
        updateFilterCurrencyData([...data])
    }, [currencySearch])

    useEffect(() => {
        const data = helperService.filterArrayOnSearch(allTimeZones, ["zone"], zoneSearch);
        updateFilterTimeZonesData([...data])
    }, [zoneSearch])

    function updateUserData() {
        const prvValues: any = {
            name: userDisplayData.name,
            email: userDisplayData.email,
            currency: sessionStorage.getItem("currency_id"),
            timezone: sessionStorage.getItem("time_zone_id")
        }
        const currValues: any = {
            name: userDataToEdit.name,
            email: userDataToEdit.email,
            currency: userDataToEdit.currency?._id,
            timezone: userDataToEdit.timezone?._id
        }
        let changedKeys: any[] = [];
        try {
            for (let key in currValues) {
                if (!currValues[key]) {
                    throw new Error("Please fill required fields")
                }
                if (prvValues[key] !== currValues[key]) {
                    changedKeys.push(key)
                }
            }
            if (!changedKeys.length) {
                throw new Error("No change detected")
            }
        } catch (e: any) {
            toast.error(e.message ?? "Update Failed", { duration: 2000, id: "invalid-user-update" })
            return
        }
        const body = {
            ...(changedKeys.indexOf("name") !== -1 ? { name: userDataToEdit.name } : {}),
            ...(changedKeys.indexOf("email") !== -1 ? { email: userDataToEdit.email } : {}),
            ...(changedKeys.indexOf("currency") !== -1 ? {
                currency_id: userDataToEdit.currency._id,
                currency_name: userDataToEdit.currency.name,
                currency_name_plural: userDataToEdit.currency.name_plural,
                currency_decimal_digits: userDataToEdit.currency.decimal_digits,
                currency_code: userDataToEdit.currency.code,
                currency_icon_class: userDataToEdit.currency.icon_class,
                currency_html_code: userDataToEdit.currency.html_code,
            } : {}),
            ...(changedKeys.indexOf("timezone") !== -1 ? {
                time_zone_id: userDataToEdit.timezone._id,
                time_zone: userDataToEdit.timezone.zone,
                time_zone_gmt_time: userDataToEdit.timezone.gmt_time,
                time_zone_gmt_minutes: userDataToEdit.timezone.gmt_minutes,
            } : {}),
        }
        updateUserDataLoaderFlag(true)
        userApiService.updateUserDetails(body).then(() => {
            if (changedKeys.indexOf("timezone") !== -1) {
                sessionStorage.setItem("time_zone_id", userDataToEdit.timezone._id);
                sessionStorage.setItem("time_zone", userDataToEdit.timezone.zone)
            }
            if (changedKeys.indexOf("currency") !== -1) {
                sessionStorage.setItem("currency_id", userDataToEdit.currency._id);
                sessionStorage.setItem("currency_name", userDataToEdit.currency.name);
                sessionStorage.setItem("currency_name_plural", userDataToEdit.currency.name_plural)
                sessionStorage.setItem("currency_decimal_digits", userDataToEdit.currency.decimal_digits);
                sessionStorage.setItem("currency_code", userDataToEdit.currency.code);
            }
            if (changedKeys.indexOf("name") !== -1) {
                sessionStorage.setItem("user_alias", userDataToEdit.name)
            }
            if (changedKeys.indexOf("email") !== -1) {
                sessionStorage.setItem("user_email", userDataToEdit.email)
            }
            toast.success("User Details Updated", { duration: 1500 })
            setTimeout(() => {
                window.location.reload()
            }, 1500)
        }).catch(e => {
            updateUserDataLoaderFlag(false)
            toast.error(e?.response?.data?.message ?? "Login Failed", { duration: 1500 })
        })
    }

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
                            <img src={userImage} alt="" data-bs-toggle="offcanvas" data-bs-target="#profileDetails" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="offcanvas offcanvas-end" data-bs-backdrop="static" tabIndex={-1} id="profileDetails" aria-labelledby="staticBackdropLabel">
                <div className="offcanvas-header">
                    <div className="title">
                        <div className="logout-option" data-bs-target="#logOutConfirmModal" data-bs-toggle="modal">
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
                            <img src={userImage} alt="logo" />
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
                                <div className={`dropdown fnx-dropdown ${loadUserUpdate ? "disabled-block" : ""}`}>
                                    <a className="btn btn-outline-secondary w-100 dropdown-toggle" id="user-currency" role="button" data-bs-toggle="dropdown" aria-expanded="false" onClick={() => { updateCurrencySearchText("") }}>
                                        {userDataToEdit.currency?.name ? userDataToEdit.currency.name : "Select Currency"}
                                    </a>
                                    <ul className="dropdown-menu">
                                        <div className="field-search">
                                            <input type="text" className="form-control" name="currency-search-text" id="currency-search-text" placeholder="Search Here" value={currencySearch}
                                                onChange={(e) => {
                                                    updateCurrencySearchText(e.target.value)
                                                }} />
                                        </div>
                                        <div className="field-data">
                                            {
                                                filterCurrency.map((currency) => (
                                                    <li key={currency._id}><a className={`dropdown-item ${userDataToEdit.currency?._id === currency._id ? "active" : ""}`} onClick={() => {
                                                        updateUserEditedData({
                                                            ...userDataToEdit,
                                                            currency
                                                        })
                                                    }} >
                                                        {currency.name} ( <CurrencyCode icon={currency.icon_class} htmlCode={currency.html_code} /> )
                                                    </a></li>
                                                ))
                                            }
                                            {
                                                !filterCurrency.length &&
                                                <NoData showIcon={false} text={currencySearch.length ? "No matching results for search text" : "No Data"} />
                                            }
                                        </div>
                                    </ul>
                                </div>
                            </div>
                            <div className="col-12 form-group mb-3">
                                <label className="field-required" >Time Zone</label>
                                <div className={`dropdown fnx-dropdown ${loadUserUpdate ? "disabled-block" : ""}`}>
                                    <a className="btn btn-outline-secondary w-100 dropdown-toggle" id="user-time-zone" role="button" data-bs-toggle="dropdown" aria-expanded="false"
                                        onClick={() => updateZoneSearchText("")}>
                                        {userDataToEdit.timezone?.zone ? userDataToEdit.timezone.zone : "Select Time Zone"}
                                    </a>
                                    <ul className="dropdown-menu">
                                        <div className="field-search">
                                            <input type="text" className="form-control" name="zone-search-text" id="zone-search-text" placeholder="Search Here" value={zoneSearch}
                                                onChange={(e) => {
                                                    updateZoneSearchText(e.target.value)
                                                }} />
                                        </div>
                                        <div className="field-data">
                                            {
                                                filterTimeZones.map((timezone) => (
                                                    <li key={timezone._id}><a className={`dropdown-item ${userDataToEdit.timezone?._id === timezone._id ? "active" : ""}`} onClick={() => {
                                                        updateUserEditedData({
                                                            ...userDataToEdit,
                                                            timezone
                                                        })
                                                    }}>{timezone.zone}</a></li>
                                                ))
                                            }
                                            {
                                                !filterTimeZones.length &&
                                                <NoData showIcon={false} text={zoneSearch.length ? "No matching results for search text" : "No Data"} />
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
                        <button className="btn btn-outline-secondary" data-bs-toggle="offcanvas" data-bs-target="#profileDetails" disabled={loadUserUpdate}><i className="fa-regular fa-circle-xmark"></i> Close</button>
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

            <div className="modal fade" id="logOutConfirmModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="confirmation-modal">
                            <div className="icon">
                                <i className="fa-solid fa-circle-exclamation"></i>
                            </div>
                            <div className="text">
                                Are you sure, You want to logout?
                            </div>
                            <div className="confirmation-footer">
                                <div className="option">
                                    <button className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                </div>
                                <div className="option">
                                    <button className="btn btn-ft-outline-primary" data-bs-dismiss="modal" onClick={logout}>Logout</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
