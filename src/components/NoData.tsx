import DOMPurify from "dompurify";
import "../assets/css/components/NoData.scss"

interface NoDataProps {
    title?: string,
    text?: string,
    showIcon?: boolean
}
export default function NoData({ title = "", text = "", showIcon = true }: NoDataProps) {
    return (
        <>
            <div className="no-data">
                <div className="no-data-container">
                    {
                        showIcon &&
                        <div className="icon">
                            <i className="fa-solid fa-fan"></i>
                        </div>
                    }
                    <div className="title">{title}</div>
                    <div className="text">
                        <span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(text) }}></span>
                    </div>
                </div >
            </div >
        </>
    )
}
