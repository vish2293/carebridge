import React from "react"
import { useSelector } from "react-redux"
import { viewHistoryIcon } from "../../../assets/icons"
import { getFullDateTime, getVisitDate } from "../../../helpers"
import VisitRequestCard from "./VisitRequestCard"
import dayjs from "dayjs"

const SingleVisitData = ({ singleVisit, handleClickModal, modalAction, history }) => {
    const { singleUser } = useSelector((state) => state.user)
    return (
        <>
            <div className="user-detail-info todo-title">
                <div className="contact-info w-50">
                    <div className="heading f-14 black bold600">Visit Type </div>
                    <div className="heading f-14 secondary60 bold400">{singleVisit?.visitData?.visitType ? singleVisit?.visitData?.visitType : "-"} </div>
                </div>
                <div className="contact-info w-50">
                    <div className="heading f-14 black bold600">Visit Date</div>
                    <div className="heading f-14 secondary60 bold400">{dayjs(singleVisit?.visitData?.visitDate) ? getFullDateTime(singleVisit?.visitData?.visitDate) : "-"}</div>
                </div>
            </div>

            <div className="user-detail-info todo-title">
                <div className="contact-info w-50">
                    <div className="heading f-14 black bold600">Length Of Visit </div>
                    {
                        singleVisit?.visitData?.lengthOfvisit ? <div className="heading f-14 secondary60 bold400">{singleVisit?.visitData?.lengthOfvisit ? `${singleVisit?.visitData?.lengthOfvisit} ${singleVisit?.visitData?.lengthOfvisitUnit}` : "-"} </div> :
                            <div className="heading f-14 secondary60 bold400">{singleVisit?.visitData?.lengthOfVisit ? singleVisit?.visitData?.lengthOfVisit : "-"} </div>

                    }
                </div>
                <div className="contact-info w-50">
                    <div className="heading f-14 black bold600">Client Story</div>
                    <div className="heading f-14 secondary60 bold400">{singleVisit?.visitData?.clientStory ? singleVisit?.visitData?.clientStory : "-"}</div>
                </div>
                <div className="contact-info">
                    <div className="heading f-14 black bold600 client-goal">
                        <span>Client Goal</span>
                        {modalAction !== "visitHistory" && <span onClick={() => handleClickModal('viewGoal', true)}>{viewHistoryIcon}</span>}
                    </div>
                    {history ? <div className="heading f-14 secondary60 bold400">{singleVisit?.visitData?.clientGoal ? singleVisit?.visitData?.clientGoal : "-"}</div> :
                        <div className="heading f-14 secondary60 bold400">{singleUser?.client_goal ? singleUser?.client_goal : "-"}</div>}
                </div>
            </div>

            <div className="user-detail-info todo-title">
                <div className="contact-info w-50">
                    <div className="heading f-14 black bold6000" style={{ fontWeight: '600' }}>Primary Need </div>
                    <div className="heading f-14 secondary60 bold400">
                        {
                            singleVisit?.visitData?.primaryNeed?.length
                                ? singleVisit.visitData.primaryNeed.map((need, index) => (
                                    <span key={need?._id}>
                                        {need?.name}
                                        {index < singleVisit.visitData.primaryNeed.length - 1 && ', '}
                                    </span>
                                ))
                                : "-"
                        }
                    </div>
                </div>
                <div className="contact-info w-50">
                    <div className="heading f-14 black bold600">Pathway</div>
                    <div className="heading f-14 secondary60 bold400">
                        {singleVisit?.visitData?.pathway && singleVisit.visitData.pathway.length > 0
                            ? singleVisit.visitData.pathway.map(path => path.name).join(', ')
                            : "-"}
                    </div>
                </div>
            </div>

            <div className="form-head">Plan</div>
            <div className="user-detail-info todo-title">
                <div className="contact-info w-50">
                    <div className="heading f-14 black bold600">Follow-up Date</div>
                    {singleVisit?.visitData?.followupDate ? <div className="heading f-14 secondary60 bold400">{dayjs(singleVisit?.visitData?.followupDate) ? getFullDateTime(singleVisit?.visitData?.followupDate) : "-"}</div> :
                        <div className="heading f-14 secondary60 bold400">{dayjs(singleVisit?.visitData?.followUpdate) ? getFullDateTime(singleVisit?.visitData?.followUpdate) : "-"}</div>
                    }
                </div>
            </div>
            <div className="user-detail-info todo-title">
                <div className="contact-info w-50">
                    <div className="heading f-14 black bold600">Reason for next important date</div>
                    {
                        singleVisit?.visitData?.followupReason ? <div className="heading f-14 secondary60 bold400">{singleVisit?.visitData?.followupReason ? singleVisit?.visitData?.followupReason : "-"}</div> :
                            <div className="heading f-14 secondary60 bold400">{singleVisit?.visitData?.followUpReason ? singleVisit?.visitData?.followUpReason : "-"}</div>
                    }
                </div>
            </div>

            {singleVisit?.requestData && singleVisit?.requestData.length > 0 && <div className="form-head">Action Steps</div>}
            {
                singleVisit?.requestData?.map((requestData, i) => (
                    <React.Fragment key={i} >
                        <VisitRequestCard item={requestData} index={i} handleClickModal={handleClickModal} />
                    </React.Fragment>
                ))
            }
        </>
    )
}

export default SingleVisitData