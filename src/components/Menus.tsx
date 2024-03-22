import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { ROUTER_MENUS } from "../router/router-menus";
import { ROUTER_KEYS } from "../router/router-keys";

export default function Menus() {

    const navigate = useNavigate();
    const location = useLocation();

    const [current_path, setCurrentPath] = useState("");
    const [menu_list, setMenusList]: any[] = useState([]);

    useEffect(() => {
        let menus_to_add: any[] = [];
        for (let item of ROUTER_MENUS) {
            menus_to_add.push({
                ...item,
                ...ROUTER_KEYS[item.key]
            })
        }
        setMenusList(menus_to_add)
    }, [])

    useEffect(() => {
        setCurrentPath(window.location.pathname)
    }, [location])

    /**
     * The function redirects to a specified menu path and updates the current path.
     * @param {any} menu - The `menu` parameter is an object that represents a menu item. It likely has
     * properties such as `path`, which represents the URL path to navigate to when the menu item is
     * clicked.
     */
    function redirectTo(menu: any) {
        setCurrentPath(menu.url)
        navigate(menu.url)
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

    return (
        <>
            <div className="menu-close-option" onClick={toggleMenu}>
                <i className="fa-solid fa-xmark"></i>
            </div>
            <div className="menu-list">
                <ul className="menu-content">
                    {menu_list.map((menu: any) => (
                        <li className={`${(current_path === menu.url && 'active')}`} onClick={() => redirectTo(menu)} key={menu.path}>
                            <a>
                                <div className="menu-icon">
                                    <i className={menu.icon}></i>
                                </div>
                                <div className="menu-name">
                                    {menu.name}
                                </div>
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    )
}
