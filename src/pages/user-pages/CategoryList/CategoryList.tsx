import "./CategoryList.scss"

export default function CategoryList() {
    return (
        <>
            <div className="page-body no-header">
                <div className="category-container">
                    <div className="category-block">
                        <div className="category-header">
                            <div className="category-title">
                                Spend Catagories
                            </div>
                            <div className="category-options">
                                <button className="btn btn-outline-secondary btn-sm" ><i className="fa-solid fa-plus"></i> Add New</button>
                            </div>
                        </div>
                        <div className="category-body">
                            {
                                Array(30).fill(0).map((_e, i) => (
                                    <div className="category-item" key={i}>
                                        <div className="card">
                                            <div className="card-body"></div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                    <div className="category-block">
                        <div className="category-header">
                            <div className="category-title">
                                Income Catagories
                            </div>
                            <div className="category-options">
                                <button className="btn btn-outline-secondary btn-sm" ><i className="fa-solid fa-plus"></i> Add New</button>
                            </div>
                        </div>
                        <div className="category-body">
                            {
                                Array(30).fill(0).map((_e, i) => (
                                    <div className="category-item" key={i}>
                                        <div className="card">
                                            <div className="card-body"></div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
