import dayjs from "dayjs"
import { getNumericDate } from "../../../helpers"

const renderDetail = (values, combinedTranslation, textWidth) => {

    return (
        <div className={`contact-info ${textWidth}`}>
            <div className='heading black f-14 bold600'> {values}</div>
            <div className='heading secondary60 f-14 bold400'> {values === "Date of Birth" ? getNumericDate(combinedTranslation[0]) : combinedTranslation?.length > 1 ? combinedTranslation[0] : combinedTranslation}</div>
        </div>)
}

const RenderUserPersonalDetail = ({ values, combinedTranslation }) => {
    if (values[0] === "Date of Birth") {
        return renderDetail("Date of Birth", combinedTranslation, "w-50")
    } else if (values[0] === "High School/ GED") {
        return renderDetail(values[0], combinedTranslation, "w-100")
    } else if (values[0] === "Job") {
        return renderDetail(values[0], combinedTranslation, "w-100")
    } else if (values[0] === "Spoken with a BOL Community Health Worker") {
        return renderDetail(values[0], combinedTranslation, "w-100")
    } else if (values[0] === "Hear about us") {
        return renderDetail(values[0], combinedTranslation, "w-100")
    } else {
        return renderDetail(values[0], combinedTranslation, "w-50")
    }

    // switch (values[0]) {
    //     case "Preferred Pronouns":
    //         return renderDetail(values[0], combinedTranslation, "w-50")
    //     case "Date of Birth":
    //         return renderDetail("Date of Birth", combinedTranslation, "w-50")
    //     case "Race/Ethnicity":
    //         return renderDetail(values[0], combinedTranslation, "w-50")
    //     case "Preferred Language":
    //         return renderDetail(values[0], combinedTranslation, "w-50")
    //     case "Housing":
    //         return renderDetail(values[0], combinedTranslation, "w-100")
    //     case "Food":
    //         return renderDetail(values[0], combinedTranslation, "w-50")
    //     case "Bills":
    //         return renderDetail(values[0], combinedTranslation, "w-50")
    //     case "Transportation":
    //         return renderDetail(values[0], combinedTranslation, "w-50")
    //     case "Childcare":
    //         return renderDetail(values[0], combinedTranslation, "w-50")
    //     case "Job":
    //         return renderDetail(values[0], combinedTranslation, "w-100")
    //     case "High School/ GED":
    //         return renderDetail(values[0], combinedTranslation, "w-100")
    //     case "Primary Care":
    //         return renderDetail(values[0], combinedTranslation, "w-50")
    //     case "Certification Interest":
    //         return renderDetail(values[0], combinedTranslation, "w-50")
    //     case "Expressed Need":
    //         return renderDetail(values[0], combinedTranslation, "w-50")
    //     case "Best Time to Contact":
    //         return renderDetail(values[0], combinedTranslation, "w-50")
    //     case "Spoken with a BOL Community Health Worker":
    //         return renderDetail(values[0], combinedTranslation, "w-100")
    //     case "Hear about us":
    //         return renderDetail(values[0], combinedTranslation, "w-100")
    //     default: 
    //         break;
    // }
}
export default RenderUserPersonalDetail