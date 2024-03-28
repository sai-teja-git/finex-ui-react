import CurrencyCode from "./CurrencyCode"

interface CurrencyProps {
    value: string | number
}

export default function Currency({ value }: CurrencyProps) {

    return (
        <>
            <div className="currency">
                <div className="symbol">
                    <CurrencyCode />
                </div>
                <div className="value">
                    {value}
                </div>
            </div>
        </>
    )
}
