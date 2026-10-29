import { Collapse, Modal, Tabs, Spin, Divider } from "antd"
import { useEffect, useState } from "react"
import SingleVisitData from "../../VisitDetail/SingleVisitData"
import dayjs from "dayjs"
import DataNotfound from "../../../components/common/DataNotFound"

const VisitHistory = ({ isOpen, modalClose, data, visitHistoryLoader, modalAction }) => {
    const [mode, setMode] = useState('top');
    const [visitData, setVisitData] = useState([])

    const handleCancel = () => {
        modalClose()
    }

    const GetvisitItemsLabel = ({ items }) => {
        return (
            <div className="visit-modal-header">
                <div className="visit-head">Visit Time ({dayjs(items?.createdAt).format("hh:mm A")})</div>
                <div>
                    <span>Created By : </span>
                    <span>{items?.createdBy ? items?.createdBy?.firstName : "---"}</span>
                </div>
                <div>
                    <span> Modified By : </span>
                    <span>{items?.modifiedBy ? items?.modifiedBy?.firstName : "---"}</span>
                </div>
            </div>
        )
    }
    const getVisitItems = (data) => {
        return data?.map((items, i) => {
            return {
                key: i + 1,                
                label: <GetvisitItemsLabel items={items} />,
                children: <SingleVisitData singleVisit={{ visitData: items }} history={true} modalAction={modalAction} />
            }
        })
    }

    useEffect(() => {
        let tempArray = [];
        data?.forEach((dateItems, i) => {
            let obj = {
                key: i + 1,
                label: dateItems?.date,
                children: <Collapse defaultActiveKey={['1']} items={getVisitItems(dateItems?.data)} />
            }
            tempArray?.push({ ...obj })
        })
        setVisitData(tempArray)
    }, [data])

    return (
        <Modal
            open={isOpen}
            onCancel={handleCancel}
            centered={true}
            title={"Visit History"}
            footer={null}
            className="question_model"
            width={680}
        >
            {
                visitHistoryLoader ? <Spin spinning /> :
                    data?.length > 0 ?
                        <Tabs defaultActiveKey={['1']} items={visitData} type="card" tabPosition={mode} /> :
                        <DataNotfound />
            }
        </Modal >
    )
}
export default VisitHistory