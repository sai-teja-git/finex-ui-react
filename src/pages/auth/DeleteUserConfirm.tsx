import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import appLogo from "../../assets/images/logos/finex-logo-dark.png";
import userApiService from "../../api/user.api.service";
import Spinner from "../../components/Spinner/Spinner.tsx"
import toast from "react-hot-toast";

export default function DeleteUserConfirm() {
    /* The `const pageWaitSec = 4` line is declaring a constant variable named `pageWaitSec` and
    assigning it a value of `4`. This variable is used to store the number of seconds for a page
    close countdown in the `UserVerification` component. It is used to determine how long the page
    will wait before closing automatically after a certain action is completed. */
    const pageWaitSec = 4;

    const [searchParams] = useSearchParams();
    const [chekingLink, setCheckingLink] = useState(true)
    const [userName, setUserName] = useState("")
    const [loadConfirm, updateloadConfirm] = useState(false);
    const [pageCloseCountDown, updatePageCloseCountDown] = useState(pageWaitSec);
    const [deletedMsg, updateDeletedMsg] = useState("");

    useEffect(() => {
        sessionStorage.clear()
        document.body.setAttribute("app-data-theme", "light");
        document.body.setAttribute("data-bs-theme", "light");
        getUserName()
    }, [])

    const getUserName = () => {
        userApiService.getDeletingUserName(searchParams.get("code") ?? "").then((res) => {
            const data = res.data
            setUserName(data.data.name)
            console.log("res", data)
            setCheckingLink(false)
            updateDeletedMsg("");
        }).catch(() => {
            updateDeletedMsg("Invalid Link/Link Expired");
            setCheckingLink(false);
            startPageCloseCountDown();
        })
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

    const clickOnDelete = () => {
        updateloadConfirm(true)
        userApiService.userDeleteConfirmed(searchParams.get("code") ?? "").then(() => {
            startPageCloseCountDown();
            updateDeletedMsg("User Deleted");
            updateloadConfirm(false)
            toast.success("User Deleted", { duration: 3000 });
        }).catch(e => {
            const msg = e?.response?.data?.message ?? "Failed To Delete User";
            toast.error(msg, { duration: 3000 });
            startPageCloseCountDown();
            updateloadConfirm(false)
            updateDeletedMsg("Failed To Delte User");
        })
    }

    const deleteFormTemplate = () => {
        if (deletedMsg) {
            return <>
                <div className="info-msg">
                    <div>{deletedMsg}, Page will close in {pageCloseCountDown}</div>
                </div>
            </>
        } else {
            return <>
                <div className="form-container">
                    <div className="form-title as-msg">
                        Click on &nbsp;<span className="delete-text-info">Delete</span>&nbsp; To delete User :&nbsp;<span className="delete-user-name">{userName}</span>
                    </div>
                    <div className="form-data">
                        <div className="form-btn">
                            {
                                loadConfirm ?
                                    <button className="btn btn-ft-primary w-100" type="button" disabled>
                                        <span className="spinner-border spinner-border-sm" aria-hidden="true"></span> Deleting...
                                    </button>
                                    :
                                    <button className="btn btn-ft-primary w-100" type="button" onClick={clickOnDelete}>Delete</button>
                            }
                        </div>
                    </div>
                </div>
            </>
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-container ">
                <div className="logo-container">
                    <img src={appLogo} alt="" />
                </div>
                {
                    chekingLink ? <Spinner /> : <>{deleteFormTemplate()}</>
                }
            </div>
        </div>
    )
}
