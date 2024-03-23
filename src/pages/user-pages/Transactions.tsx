import "../../assets/css/pages/Transactions.scss"

export default function Transactions() {
    return (
        <>
            {/* <NoData title="No Data" text={"Data not available for the page"} /> */}
            <div className="page-body no-header">
                <div className="transactions-page">
                    <div className="transactions-data">
                        <div className="card">
                            <div className="card-body"></div>
                        </div>
                    </div>
                    <div className="transactions-data">
                        <div className="card">
                            <div className="card-body"></div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <div className="row m-0">
                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                    <div className="card">
                        <div className="card-body">
                            Transactions
                        </div>
                    </div>
                </div>
                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12"></div>
            </div> */}
        </>
    )
}
