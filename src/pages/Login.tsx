import { useNavigate } from "react-router-dom"
import { ROUTER_KEYS } from "../router/router-keys"
import { useEffect } from "react";

export default function Login() {

    const navigate = useNavigate()

    useEffect(() => {
        sessionStorage.clear()
        document.body.setAttribute("app-data-theme", "light");
        document.body.setAttribute("data-bs-theme", "light");
    }, [])

    function verifyUser() {
        const data: Record<string, string> = {
            "currency_name": "Indian Rupee",
            "time_zone": "Asia/Kolkata",
            "currency_icon": "fa-solid fa-indian-rupee-sign",
            "username": "sai_teja",
            "currency_decimal_digits": "2",
            "currency_code": "&#8377;",
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
            <div className="login-center">
                <button className="btn btn-outline-secondary ms-3" onClick={verifyUser}>Login</button>
            </div>
        </>
    )
}