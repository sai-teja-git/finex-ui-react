import DOMPurify from "dompurify";

interface ICurrencyData {
    icon?: string;
    htmlCode?: string
}

/**
 * The `getCurrencyCode` function takes in two parameters: `icon` and `htmlCode`, both of type string. if icon is valid
 * it will return icon value else it will return currency html code
 * @param icon icon class
 * @param htmlCode currency html code
 * @returns HTML Element to display currency symbol
 */
function getCurrencyCode(icon: string, htmlCode: string) {
    if (icon) {
        return <i className={icon}></i>
    } else {
        return <span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(htmlCode) }}></span>
    }
}

export default function CurrencyCode({
    icon = sessionStorage.getItem("currency_icon") as string,
    htmlCode = sessionStorage.getItem("currency_html_code") as string
}: ICurrencyData) {
    return (
        getCurrencyCode(icon, htmlCode)
    )
}
