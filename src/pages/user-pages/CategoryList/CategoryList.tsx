import { useEffect, useState } from "react";
import "./CategoryList.scss"
import catagoriesApiService from "../../../api/categories.api.service";
import NoData from "../../../components/NoData";
import transformationService from "../../../services/transformations.service";
import commonApiService from "../../../api/common.api.service";
import toast from "react-hot-toast";

export default function CategoryList() {
    const [categoryFormData, updateCategoryFormData] = useState<any>({
        name: "",
        icon_category: {},
        selected_icon: {}
    })

    const [loadCategories, updateCategoryLoadFlag] = useState(true);
    const [loadCategoryModify, updateCategoryModifyLoadFlag] = useState(false);
    const [userSpendCatagories, updateUserSpendCategoriesData] = useState<any>([]);
    const [userIncomeCatagories, updateUserIncomeCategoriesData] = useState<any>([]);
    const [formCategoryType, updateFormCategoryType] = useState("")
    const [usedIcons, updateUsedIcons] = useState({});
    const [iconCategoryData, updateIconCategoryData] = useState<any[]>([]);
    const [selectedCatIconData, updateSingleCatIconData] = useState([]);

    useEffect(() => {
        getUserCatagories();
        getAllIcons()
    }, [])

    function getUserCatagories() {
        updateCategoryLoadFlag(true)
        catagoriesApiService.getUserCategories().then(res => {
            const { spend_categories, income_categories } = res.data;
            updateUserIncomeCategoriesData([...income_categories]);
            updateUserSpendCategoriesData([...spend_categories]);
            let usedIcons: any = {};
            for (let category of income_categories) {
                usedIcons[category.icon] = category.icon_id
            }
            for (let category of spend_categories) {
                usedIcons[category.icon] = category.icon_id
            }
            updateUsedIcons({ ...usedIcons })
            console.log('usedIcons', usedIcons)
            updateCategoryLoadFlag(false)
        }).catch(() => {
            updateUserIncomeCategoriesData([]);
            updateUserSpendCategoriesData([]);
            updateUsedIcons({})
            updateCategoryLoadFlag(false);
        })
    }

    function getAllIcons() {
        commonApiService.getAllIcons().then((res: any) => {
            updateIconCategoryData([...(res.data?.data ?? [])])
        }).catch(() => {
            updateIconCategoryData([])
        })
    }

    function openAddCategoryForm(type: string) {
        updateFormCategoryType(type)
        const defaultCat = iconCategoryData[0] ?? {}
        updateCategoryFormData({
            name: "",
            icon_category: defaultCat,
            selected_icon: {}
        })
        if (iconCategoryData[0]) {
            updateSingleCatIconData(defaultCat.icons)
        } else {
            updateSingleCatIconData([])
        }
        $("#categoryLog").offcanvas("show")
    }

    function loaderTemplate(type: string) {
        return Array(14).fill(0).map((_e, i) => (
            <div className="category-item" key={type + i}>
                <div className="card">
                    <div className="card-body">
                        <div className="edit-option disabled-block">-
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
                                <button className="btn btn-outline-secondary btn-sm" disabled={loadCategories || !userSpendCatagories.length || !userIncomeCatagories.length}
                                    onClick={() => openAddCategoryForm("spend")}><i className="fa-solid fa-plus"></i> Add New</button>
                            </div>
                        </div>
                        <div className={`category-body placeholder-glow ${!loadCategories && !userSpendCatagories.length ? "d-flex justify-content-center" : ""}`}>
                            {
                                loadCategories ? loaderTemplate("spend")
                                    :
                                    <>
                                        {
                                            userSpendCatagories.map((category: any) => (
                                                <div className="category-item" key={category._id}>
                                                    <div className="card">
                                                        <div className="card-body">
                                                            <div className="edit-option">
                                                                <div className="edit">
                                                                    Edit
                                                                </div>
                                                            </div>
                                                            <div className="icon">
                                                                <i className={category.icon}></i>
                                                            </div>
                                                            <div className="name">
                                                                {category.name}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                        {
                                            !userSpendCatagories.length && <NoData title="No Data" />
                                        }
                                    </>
                            }
                        </div>
                    </div>
                    <div className="category-block">
                        <div className="category-header">
                            <div className="category-title">
                                Income Catagories
                            </div>
                            <div className="category-options">
                                <button className="btn btn-outline-secondary btn-sm" disabled={loadCategories || !userSpendCatagories.length || !userIncomeCatagories.length}><i className="fa-solid fa-plus"></i> Add New</button>
                            </div>
                        </div>
                        <div className={`category-body placeholder-glow ${!loadCategories && !userIncomeCatagories.length ? "d-flex justify-content-center" : ""}`}>
                            {
                                loadCategories ? loaderTemplate("income")
                                    :
                                    <>
                                        {
                                            userIncomeCatagories.map((category: any) => (
                                                <div className="category-item" key={category._id}>
                                                    <div className="card">
                                                        <div className="card-body">
                                                            <div className="edit-option">
                                                                <div className="edit">
                                                                    Edit
                                                                </div>
                                                            </div>
                                                            <div className="icon">
                                                                <i className={category.icon}></i>
                                                            </div>
                                                            <div className="name">
                                                                {category.name}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                        {
                                            !userIncomeCatagories.length && <NoData title="No Data" />
                                        }
                                    </>
                            }
                        </div>
                    </div>
                </div>
            </div>

            <div className="offcanvas offcanvas-end" data-bs-backdrop="static" tabIndex={-1} id="categoryLog" aria-labelledby="staticBackdropLabel">
                <div className="offcanvas-header border-bottom">
                    <div className="title">
                        Add {transformationService.titleCase(formCategoryType)} Category
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
                            <label className="field-required" htmlFor="icon-category">Icon Category</label>
                            <div className={`dropdown fnx-dropdown ${loadCategoryModify ? "disabled-block" : ""}`}>
                                <a className="btn btn-outline-secondary w-100 dropdown-toggle" id="user-currency" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    {categoryFormData.icon_category?.alias ? categoryFormData.icon_category.alias : "Select Icon Category"}
                                </a>
                                <ul className="dropdown-menu">
                                    <div className="field-data">
                                        {
                                            iconCategoryData.map((iconCat) => (
                                                <li key={iconCat._id}><a className={`dropdown-item ${categoryFormData.icon_category?._id === iconCat._id ? "active" : ""}`} onClick={() => {
                                                    updateCategoryFormData({
                                                        ...categoryFormData,
                                                        icon_category: iconCat
                                                    })
                                                    updateSingleCatIconData(iconCat.icons)
                                                }} >
                                                    {iconCat.alias}
                                                </a></li>
                                            ))
                                        }
                                        {
                                            !iconCategoryData.length &&
                                            <NoData showIcon={false} text="No Data" />
                                        }
                                    </div>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="icon-select">
                        <label className="field-required">Select Icon</label>
                        <div className={`data ${!selectedCatIconData.length ? "justify-content-center" : ""}`}>
                            {
                                selectedCatIconData.map((icon: any) => (
                                    <div className="icon-block" key={icon._id} >
                                        <div className={`icon-value ${categoryFormData.selected_icon?._id == icon._id ? "selected" : ""}`} onClick={() => {
                                            if (icon.icon in usedIcons) {
                                                toast.error("Icon already in use", { duration: 2000, id: "used-icon" })
                                            } else {
                                                updateCategoryFormData({
                                                    ...categoryFormData,
                                                    selected_icon: icon
                                                })
                                            }
                                        }} >
                                            <i className={icon.icon}></i>
                                        </div>
                                    </div>
                                ))
                            }
                            {
                                !selectedCatIconData.length && <NoData title="No Data" />
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
