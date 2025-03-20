import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import appLogo from "../../assets/images/logos/finex-logo-dark.png";
import userApiService from "../../api/user.api.service";

export default function DeleteUserConfirm() {
    /* The `const pageWaitSec = 4` line is declaring a constant variable named `pageWaitSec` and
    assigning it a value of `4`. This variable is used to store the number of seconds for a page
    close countdown in the `UserVerification` component. It is used to determine how long the page
    will wait before closing automatically after a certain action is completed. */
    const pageWaitSec = 4;

    const [searchParams] = useSearchParams();
    const [loadConfirm, updateloadConfirm] = useState(false);
    const [pageCloseCountDown, updatePageCloseCountDown] = useState(pageWaitSec);
    const [isDeleted, updateIsDeleted] = useState(false)

    useEffect(() => {
        sessionStorage.clear()
        document.body.setAttribute("app-data-theme", "light");
        document.body.setAttribute("data-bs-theme", "light");
        getUserName()
    }, [])

    const getUserName = () => {
        userApiService.getDeletingUserName(searchParams.get("code") ?? "").then((res) => { console.log("res", res) }).catch(e => e)
    }

    return (
        <div className="auth-page">
            <div className="auth-container ">
                <div className="logo-container">
                    <img src={appLogo} alt="" />
                </div>
                <div className="form-container">
                    <div className="form-title">
                        Click on &nbsp;<span className="delete-text-info">Delete</span>&nbsp; To delete User :&nbsp;<span className="delete-user-name">Test</span>
                    </div>
                    <div className="form-data">
                        {
                            isDeleted ?
                                <div className="info-msg">
                                    <div>User Deleted, Page will close in {pageCloseCountDown}</div>
                                </div>
                                :
                                <div className="form-btn">
                                    {
                                        loadConfirm ?
                                            <button className="btn btn-ft-primary w-100" type="button" disabled>
                                                <span className="spinner-border spinner-border-sm" aria-hidden="true"></span> Deleting...
                                            </button>
                                            :
                                            <button className="btn btn-ft-primary w-100" type="button">Delete</button>
                                    }
                                </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
