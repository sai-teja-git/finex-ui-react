import DOMPurify from "dompurify";

interface ICurrencyData {
    icon?: string;
    htmlCode?: string
}

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
