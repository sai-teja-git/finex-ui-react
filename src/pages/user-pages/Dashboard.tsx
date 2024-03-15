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
                        Array(5).fill(null).map((e, i) => (
                            <div className="overall-block" key={i} >
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

    function overallDataNewCard(){
        return <>
        <div className="overview">
            {
                Array(4).fill(0).map((e,i)=>(

            <div className="overview-block">
                <div className="block-left">
                    <div className="amount">
                            <Currency value={overall_card_details["total_spends"] ? overall_card_details["total_spends"] : 0} />
                    </div>
                    <div className="name">
                        Spends
                    </div>
                </div>
                <div className="block-right">
                    <div className="icon">
                            <i className="fa-solid fa-money-bill-trend-up"></i>
                    </div>
                </div>
            </div>
                ))
            }
        </div>
        </>
    }

    return (
        <>
            <div className="page-body no-header">
                <div className="row m-0">
                    <div className="col-12 p-0">
                        <div className="card-body">
                            {overallDataNewCard()}
                        </div>
                    </div>
                    <div className="col-lg-8 col-md-12 col-sm-12 mt-3 ps-0">
                        <div className="card">
                            <div className="card-header">
                                Spends Data
                            </div>
                            <div className="card-body p-0">
                                <div className="custom-table">
                                    <table className="sticky-head">
                                        <thead>
                                            <tr>
                                                <th>Category</th>
                                                <th>Amount</th>
                                                <th>Count</th>
                                                <th>Remarks</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                Array(10).fill(0).map((e, i) => (
                                                    <tr key={i}>
                                                        <td>Category-{i + 1}</td>
                                                        <td><Currency value={(i + 1) * 10} /></td>
                                                        <td>{i + 1}</td>
                                                        <td>Remarks----{i + 1}</td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
