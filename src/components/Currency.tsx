import * as DOMPurify from "dompurify";

interface CurrencyProps {
    value: string | number
}

export default function Currency({ value }: CurrencyProps) {

    const currency_icon_class = sessionStorage.getItem("currency_icon") as string;
    const currency_code = sessionStorage.getItem("currency_code") as string;

    /**
     * The `getCurrencyCode` function is a helper function defined within the `Currency` component in TypeScript React.
     * @returns currency html code
     */
    function getCurrencyCode() {
        if (currency_icon_class) {
            return <i className={currency_icon_class}></i>
        } else {
            return <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(currency_code) }}></div>
        }
    }

    return (
        <>
            <div className="currency">
                <div className="symbol">
                    {getCurrencyCode()}
                </div>
                <div className="value">
                    {value}
                </div>
            </div>
        </>
    )
}
