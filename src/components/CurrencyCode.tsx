import * as DOMPurify from "dompurify";

const currency_icon_class = sessionStorage.getItem("currency_icon") as string;
const currency_html_code = sessionStorage.getItem("currency_html_code") as string;

/**
 * The `getCurrencyCode` function is a helper function defined within the `Currency` component in TypeScript React.
 * @returns currency html code
 */
function getCurrencyCode() {
    if (currency_icon_class) {
        return <i className={currency_icon_class}></i>
    } else {
        return <span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(currency_html_code) }}></span>
    }
}

export default function CurrencyCode() {
    return (
        getCurrencyCode()
    )
}
