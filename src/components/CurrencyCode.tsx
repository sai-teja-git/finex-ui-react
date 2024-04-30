import * as DOMPurify from "dompurify";

// const currency_icon_class = sessionStorage.getItem("currency_icon") as string;
// const currency_html_code = sessionStorage.getItem("currency_html_code") as string;

function getCurrencyCode(currency_icon_class: string, currency_html_code: string) {
    if (currency_icon_class) {
        return <i className={currency_icon_class}></i>
    } else {
        return <span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(currency_html_code) }}></span>
    }
}

export default function CurrencyCode(
    currency_icon_class: string = sessionStorage.getItem("currency_icon") as string,
    currency_html_code: string = sessionStorage.getItem("currency_html_code") as string
) {
    return (
        getCurrencyCode(currency_icon_class, currency_html_code)
    )
}
