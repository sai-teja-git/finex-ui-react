import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import catagoriesApiService from "../../../api/categories.api.service";
import commonApiService from "../../../api/common.api.service";
import NoData from "../../../components/NoData";
import transformationService from "../../../services/transformations.service";
import "./CategoryList.scss";

export default function CategoryList() {
    const [categoryFormData, updateCategoryFormData] = useState<any>({
        name: "",
        icon_category: {},
        selected_icon: {}
    })

    const [loadCategories, updateCategoryLoadFlag] = useState(true);
    const [loadCategorySubmit, updateCategorySubmitLoadFlag] = useState(false);
    const [userSpendCatagories, updateUserSpendCategoriesData] = useState<any>([]);
    const [userIncomeCatagories, updateUserIncomeCategoriesData] = useState<any>([]);
    const [formCategoryType, updateFormCategoryType] = useState("");
    const [formActionType, updateFormAction] = useState("");
    const [usedIcons, updateUsedIcons] = useState({});
    const [iconCategoryData, updateIconCategoryData] = useState<any[]>([]);
    const [selectedCatIconData, updateSingleCatIconData] = useState([]);

    useEffect(() => {
        getUserCatagories();
        getAllIcons()
    }, [])

    /**
     * The function `getUserCatagories` fetches user categories data, updates state variables
     * accordingly, and handles loading flags.
     */
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
            updateCategoryLoadFlag(false)
        }).catch(() => {
            updateUserIncomeCategoriesData([]);
            updateUserSpendCategoriesData([]);
            updateUsedIcons({})
            updateCategoryLoadFlag(false);
        })
    }

    /**
     * The function `getAllIcons` fetches all icons using a common API service and updates the icon
     * category data accordingly.
     */
    function getAllIcons() {
        commonApiService.getAllIcons().then((res: any) => {
            updateIconCategoryData([...(res.data?.data ?? [])])
        }).catch(() => {
            updateIconCategoryData([])
        })
    }

    /**
     * The function `openAddCategoryForm` updates form data and displays a category form with default
     * values.
     * @param {string} type - The `type` parameter in the `openAddCategoryForm` function is a string
     * that specifies the type of category being added.
     */
    function openAddCategoryForm(type: string) {
        updateFormCategoryType(type)
        const defaultCat = iconCategoryData[0] ?? {}
        updateCategoryFormData({
            name: "",
            icon_category: defaultCat,
            selected_icon: null
        })
        if (iconCategoryData[0]) {
            updateSingleCatIconData(defaultCat.icons)
        } else {
            updateSingleCatIconData([])
        }
        updateFormAction("add")
        $("#categoryLog").offcanvas("show")
    }

    /**
     * The function `openUpdateCategoryForm` updates the form data for a selected category icon based
     * on the type and selected data provided.
     * @param {string} type - The `type` parameter in the `openUpdateCategoryForm` function is a string
     * that specifies the type of category being updated.
     * @param {any} selectedData - The `selectedData` parameter in the `openUpdateCategoryForm`
     * function is an object that contains information about a selected category. This information
     * typically includes the category's name, icon type ID, icon ID, and other relevant data needed to
     * update the category.
     */
    function openUpdateCategoryForm(type: string, selectedData: any) {
        updateFormCategoryType(type)
        updateFormAction("update")
        try {
            const categoryType = iconCategoryData.find(e => e._id === selectedData.icon_type_id)
            if (categoryType) {
                const categoryIcons: any[] = categoryType.icons
                updateSingleCatIconData(categoryType.icons)
                const iconData = categoryIcons.find(e => e._id === selectedData.icon_id)
                if (iconData) {
                    updateCategoryFormData({
                        name: selectedData.name,
                        icon_category: categoryType,
                        selected_icon: { ...iconData, icon_type_id: selectedData.icon_type_id },
                        record_id: selectedData._id,
                        previous: selectedData
                    })
                    $("#categoryLog").offcanvas("show")
                } else {
                    throw new Error("Unable to set data")
                }
            } else {
                throw new Error("Unable to set data")
            }
        } catch (e: any) {
            toast.error(e.message ?? "Unable open", { duration: 2500, id: "invalid-update-data" })
        }
    }

    /**
     * The function `createUserCategory` handles the creation or update of user categories with
     * validation checks and API calls.
     * @returns The `createUserCategory` function returns either nothing (undefined) or exits early
     * with a `return` statement if an error is caught during the execution of the function. If no
     * errors occur, it will proceed with updating the category submit load flag, and depending on the
     * `formActionType`, it will either call `patchUserCategory()` and return, or it will create a new
     * category by sending
     */
    function createUserCategory() {
        try {
            if (!categoryFormData.name || !categoryFormData.selected_icon) {
                throw new Error("Please fill the required fields")
            }
            if (!Object.keys(categoryFormData.selected_icon).length) {
                throw new Error("Please fill the required fields")
            }
            for (let category of userSpendCatagories) {
                const newKey = categoryFormData.name.toLocaleLowerCase().split(" ").join("_")
                if (category.key === newKey) {
                    if (formActionType === "add") {
                        throw new Error(`There is Category with same name, use another name`)
                    } else if (formActionType === "update" && category._id !== categoryFormData.record_id) {
                        throw new Error(`There is Category with same name, use another name`)
                    }
                }
            }
        } catch (e: any) {
            toast.error(e.message ?? "Creation Failed", { duration: 2500, id: "invalid-category-create" })
            return
        }
        updateCategorySubmitLoadFlag(true)
        if (formActionType === "update") {
            patchUserCategory()
            return;
        }
        const body = {
            key: categoryFormData.name.toLocaleLowerCase().split(" ").join("_").toLocaleLowerCase().split(" ").join("_"),
            name: categoryFormData.name,
            icon: categoryFormData.selected_icon.icon,
            icon_id: categoryFormData.selected_icon._id,
            icon_type_id: categoryFormData.selected_icon.icon_type_id,
            type: formCategoryType
        }
        catagoriesApiService.createUserCategories(body).then(() => {
            getUserCatagories();
            $("#categoryLog").offcanvas("hide")
            updateCategorySubmitLoadFlag(false)
        }).catch(e => {
            updateCategorySubmitLoadFlag(false)
            toast.error(e?.response?.data?.message ?? `Creation Failed`, { duration: 1500 })
        })
    }

    /**
     * The function `patchUserCategory` updates user categories based on changes in category data and
     * handles success or failure notifications.
     * @returns The `patchUserCategory` function returns either a toast message indicating "No Change"
     * if there are no changes detected in the category data, or it updates the user categories by
     * calling the `updateUserCategories` method from `catagoriesApiService`, then retrieves the
     * updated user categories by calling `getUserCatagories`, hides the category log offcanvas
     * element, and sets the category submit load flag
     */
    function patchUserCategory() {
        const body: any = {
            key: categoryFormData.name.toLocaleLowerCase().split(" ").join("_").toLocaleLowerCase().split(" ").join("_"),
            name: categoryFormData.name,
            icon: categoryFormData.selected_icon.icon,
            icon_id: categoryFormData.selected_icon._id,
            icon_type_id: categoryFormData.selected_icon.icon_type_id,
        }
        const check_keys = ["name", "icon_id", "icon_type_id"]
        let dataChange = false;
        for (let key of check_keys) {
            if (body[key] !== categoryFormData.previous[key]) {
                dataChange = true
            }
        }
        if (!dataChange) {
            toast.error("No Change", { duration: 1500, id: "no-change-in-update" })
            updateCategorySubmitLoadFlag(false)
            return
        }
        catagoriesApiService.updateUserCategories(categoryFormData.record_id, body).then(() => {
            getUserCatagories();
            $("#categoryLog").offcanvas("hide")
            updateCategorySubmitLoadFlag(false)
        }).catch(e => {
            updateCategorySubmitLoadFlag(false)
            toast.error(e?.response?.data?.message ?? `Update Failed`, { duration: 1500 })
        })
    }

    /**
     * The function `loaderTemplate` generates a template for displaying a loading animation for a
     * specified type of content.
     * @param {string} type - The `loaderTemplate` function takes a `type` parameter of type string.
     * This function generates an array of 14 elements, each representing a category item with
     * placeholder content. The `type` parameter is used in generating unique keys for each category
     * item.
     * @returns The `loaderTemplate` function is returning an array of 14 div elements with class names
     * "category-item", "card", "card-body", "edit-option disabled-block", "edit", "icon", "name", and
     * placeholders for content. Each div element has a unique key based on the `type` parameter and
     * the index `i`.
     */
    function loaderTemplate(type: string) {
        return Array(14).fill(0).map((_e, i) => (
            <div className="category-item" key={type + i}>
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
                                                                <div className="edit" onClick={() => openUpdateCategoryForm("spend", category)}>
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
                                <button className="btn btn-outline-secondary btn-sm" disabled={loadCategories || !userSpendCatagories.length || !userIncomeCatagories.length}
                                    onClick={() => openAddCategoryForm("income")}><i className="fa-solid fa-plus"></i> Add New</button>
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
                                                                <div className="edit" onClick={() => openUpdateCategoryForm("income", category)}>
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
                        {transformationService.titleCase(formActionType)} {transformationService.titleCase(formCategoryType)} Category
                    </div>
                    <div className="options">
                        <div className={`option-item close ${loadCategorySubmit ? " disabled-block" : ""}`}>
                            <i className="fa-solid fa-xmark" data-bs-dismiss="offcanvas"></i>
                        </div>
                    </div>
                </div>
                <div className="offcanvas-body">
                    <div className="row">
                        <div className="col-12 form-group">
                            <label className="field-required" htmlFor="category-name">name</label>
                            <input type="text" id="category-name" name="category-name" className="form-control" placeholder="Enter Category Name" value={categoryFormData.name} disabled={loadCategorySubmit}
                                onChange={(e) => {
                                    updateCategoryFormData({
                                        ...categoryFormData,
                                        name: e.target.value
                                    })
                                }} />
                        </div>
                        <div className="col-12 mt-3">
                            <label className="field-required">Icon Category</label>
                            <div className={`dropdown fnx-dropdown ${loadCategorySubmit ? "disabled-block" : ""}`}>
                                <a className="btn btn-outline-secondary w-100 dropdown-toggle" id="icon-category" role="button" data-bs-toggle="dropdown" aria-expanded="false">
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
                        <div className="label-text">
                            <label className="field-required">Select Icon</label>
                            {
                                categoryFormData.selected_icon?.icon &&
                                <div className="selected-icon">
                                    <i className={categoryFormData.selected_icon.icon}></i>
                                </div>
                            }
                        </div>
                        <div className={`data ${!selectedCatIconData.length ? "justify-content-center" : ""} ${loadCategorySubmit ? "disabled-block" : ""}`}>
                            {
                                selectedCatIconData.map((icon: any) => (
                                    <div className="icon-block" key={icon._id} >
                                        <div className={`icon-value ${categoryFormData.selected_icon?._id == icon._id ? "selected" : ""}`} onClick={() => {
                                            if (icon.icon in usedIcons) {
                                                toast.error("Icon already in use", { duration: 2000, id: "used-icon" })
                                            } else {
                                                updateCategoryFormData({
                                                    ...categoryFormData,
                                                    selected_icon: { ...icon, icon_type_id: categoryFormData.icon_category._id }
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
                        <button className="btn btn-outline-secondary" data-bs-dismiss="offcanvas" disabled={loadCategorySubmit}><i className="fa-regular fa-circle-xmark"></i> Cancel</button>
                    </div>
                    <div className="option">
                        <button className="btn btn-success" disabled={loadCategorySubmit} onClick={createUserCategory}><i className="fa-regular fa-circle-check"></i> Submit</button>
                    </div>
                </div>
            </div>
        </>
    )
}
