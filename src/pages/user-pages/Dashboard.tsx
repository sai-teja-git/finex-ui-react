import { useEffect, useState } from "react";

import "../../assets/css/components/Dashboard.scss";
import Currency from "../../components/Currency";

export default function Dashboard() {

    const [load_overall_data, setOverallDataLoader] = useState(true);
    const [overall_card_details, setOverallCardDetails] = useState<Record<string, any>>({})

    useEffect(() => {
        setTimeout(() => {
            setOverallDataLoader(false)
        }, 1000)
    }, [])

    function overallDataCard() {
        if (load_overall_data) {
            return <>
                <div className="overall-container placeholder-glow">
                    {
                        Array(5).fill(null).map(() => (
                            <div className="overall-block" >
                                <div className="block-left">
                                    <div className="icon">
                                        <span className="placeholder col-2"></span>
                                    </div>
                                </div>
                                <div className="block-right">
                                    <div className="amount">
                                        <span className="placeholder col-6"></span>
                                    </div>
                                    <div className="name">
                                        <span className="placeholder col-7"></span>
                                    </div>
                                    <div className="remarks">
                                        <span className="placeholder col-6"></span>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </>
        } else {
            return <>
                <div className="overall-container">
                    <div className="overall-block spend">
                        <div className="block-left">
                            <div className="icon">
                                <i className="fa-solid fa-money-bill-trend-up"></i>
                            </div>
                        </div>
                        <div className="block-right">
                            <div className="amount">
                                <Currency value={overall_card_details["total_spends"] ? overall_card_details["total_spends"] : 0} />
                            </div>
                            <div className="name">
                                Spends
                            </div>
                            <div className="remarks"></div>
                        </div>
                    </div>
                    <div className="overall-block estimation">
                        <div className="block-left">
                            <div className="icon">
                                <i className="fa-solid fa-file-invoice"></i>
                            </div>
                        </div>
                        <div className="block-right">
                            <div className="amount">
                                <Currency value={overall_card_details["total_estimations"] ? overall_card_details["total_estimations"] : 0} />
                            </div>
                            <div className="name">
                                Estimation
                            </div>
                            <div className="remarks"></div>
                        </div>
                    </div>
                    <div className="overall-block income">
                        <div className="block-left">
                            <div className="icon">
                                <i className="fa-solid fa-hand-holding-dollar"></i>
                            </div>
                        </div>
                        <div className="block-right">
                            <div className="amount">
                                <Currency value={overall_card_details["total_income"] ? overall_card_details["total_income"] : 0} />
                            </div>
                            <div className="name">
                                Income
                            </div>
                            <div className="remarks"></div>
                        </div>
                    </div>
                    <div className="overall-block max">
                        <div className="block-left">
                            <div className="icon">
                                <i className="fa-solid fa-arrow-trend-up"></i>
                            </div>
                        </div>
                        <div className="block-right">
                            <div className="amount">
                                <Currency value={overall_card_details["max_spend"] ? overall_card_details["max_spend"] : 0} />
                            </div>
                            <div className="name">
                                Month Max Spends
                            </div>
                            <div className="remarks">
                                {/* On {{ user_categories_object[overall_details['max_spend_on_category']].name }} */}
                                On Home
                            </div>
                        </div>
                    </div>
                    <div className="overall-block year-total">
                        <div className="block-left">
                            <div className="icon">
                                <i className="fa-solid fa-chart-bar"></i>
                            </div>
                        </div>
                        <div className="block-right">
                            <div className="amount">
                                <Currency value={overall_card_details["spend_avg"] ? overall_card_details["spend_avg"] : 0} />
                            </div>
                            <div className="name">
                                Month Average Spends
                            </div>
                            <div className="remarks">
                            </div>
                        </div>
                    </div>
                </div>
            </>
        }
    }

    return (
        <>
            <div className="row">
                <div className="col-12">
                    <div className="card-body">
                        {overallDataCard()}
                    </div>
                </div>
            </div>
        </>
    )
}
