import { useEffect, useState } from "react";
import "./CategoryList.scss"

export default function CategoryList() {
    const [dummyLoader, updateDummyLoader] = useState(true);
    const [categoryFormData, updateCategoryFormData] = useState({
        name: {},
        icon_category: "",
        icon_class: ""
    })

    useEffect(() => {
        setTimeout(() => {
            updateDummyLoader(false)
        }, 2000)
    }, [])

    function openCategoryLog() {
        $("#categoryLog").offcanvas("show")
    }

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
                                <button className="btn btn-outline-secondary btn-sm" onClick={openCategoryLog}><i className="fa-solid fa-plus"></i> Add New</button>
                            </div>
                        </div>
                        <div className="category-body placeholder-glow">
                            {
                                dummyLoader ?
                                    Array(14).fill(0).map((_e, i) => (
                                        <div className="category-item" key={i}>
                                            <div className="card">
                                                <div className="card-body">
                                                    <div className="edit-option disabled-block">
                                                        <div className="edit">
                                                            Edit
                                                        </div>
                                                    </div>
                                                    <div className="icon">
                                                        <div className="placeholder col-4"></div>
                                                    </div>
                                                    <div className="name">
                                                        <div className="placeholder col-12"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                    :
                                    Array(14).fill(0).map((_e, i) => (
                                        <div className="category-item" key={i}>
                                            <div className="card">
                                                <div className="card-body">
                                                    <div className="edit-option">
                                                        <div className="edit">
                                                            Edit
                                                        </div>
                                                    </div>
                                                    <div className="icon">
                                                        <i className="fa-solid fa-martini-glass-citrus"></i>
                                                    </div>
                                                    <div className="name">
                                                        Entertainment
                                                    </div>
                                                </div>
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
                        <div className="category-body placeholder-glow">
                            {
                                dummyLoader ?
                                    Array(14).fill(0).map((_e, i) => (
                                        <div className="category-item" key={i}>
                                            <div className="card">
                                                <div className="card-body">
                                                    <div className="edit-option disabled-block">
                                                        <div className="edit">
                                                            Edit
                                                        </div>
                                                    </div>
                                                    <div className="icon">
                                                        <div className="placeholder col-4"></div>
                                                    </div>
                                                    <div className="name">
                                                        <div className="placeholder col-12"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                    :
                                    Array(14).fill(0).map((_e, i) => (
                                        <div className="category-item" key={i}>
                                            <div className="card">
                                                <div className="card-body">
                                                    <div className="edit-option">
                                                        <div className="edit">
                                                            Edit
                                                        </div>
                                                    </div>
                                                    <div className="icon">
                                                        <i className="fa-solid fa-martini-glass-citrus"></i>
                                                    </div>
                                                    <div className="name">
                                                        Entertainment
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                            }
                        </div>
                    </div>
                </div>
            </div>

            <div className="offcanvas offcanvas-end" data-bs-backdrop="static" tabIndex={-1} id="categoryLog" aria-labelledby="staticBackdropLabel">
                <div className="offcanvas-header border-bottom">
                    <div className="title">
                        Add Category
                    </div>
                    <div className="options">
                        <div className="option-item close">
                            <i className="fa-solid fa-xmark" data-bs-dismiss="offcanvas"></i>
                        </div>
                    </div>
                </div>
                <div className="offcanvas-body">
                    <div className="row">
                        <div className="col-12 form-group">
                            <label className="field-required" htmlFor="remarks">name</label>
                            <input type="text" id="remarks" name="remarks" className="form-control" placeholder="Enter Remarks" />
                        </div>
                        <div className="col-12 mt-3">
                            <label className="field-required" htmlFor="icon-category">Category</label>
                            <div className="dropdown fnx-dropdown">
                                <a className="btn btn-outline-secondary w-100 dropdown-toggle" id="icon-category" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Spends
                                </a>

                                <ul className="dropdown-menu">
                                    <li><a className="dropdown-item active">Spends</a></li>
                                    <li><a className="dropdown-item">Income</a></li>
                                    <li><a className="dropdown-item">Estimations</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="icon-select">
                        <label className="field-required">Select Icon</label>
                        <div className="data">
                            {
                                Array(12).fill(0).map((_e, i) => (
                                    <div className="icon-block" key={i}>
                                        <div className={`icon-value ${i == 2 ? "selected" : ""}`}>
                                            <i className="fa-solid fa-file-invoice"></i>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
                <div className="offcanvas-footer end">
                    <div className="option">
                        <button className="btn btn-outline-secondary" data-bs-dismiss="offcanvas"><i className="fa-regular fa-circle-xmark"></i> Cancel</button>
                    </div>
                    <div className="option">
                        <button className="btn btn-success" ><i className="fa-regular fa-circle-check"></i> Submit</button>
                    </div>
                </div>
            </div>
        </>
    )
}
