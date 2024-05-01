import helperService from "../services/helper-functions.service"

interface CurrencyProps {
    value: string | number
}

export default function Currency({ value }: CurrencyProps) {

    return (
        <>
            <div className="currency">
                <div className="value">
                    {/* <CurrencyValue value={value} /> */}
                    {helperService.formatCurrencyValue(value)}
                </div>
            </div>
        </>
    )
}
