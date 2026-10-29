import { Button, Modal, Select, Tag, Tooltip, Upload, message } from "antd";
import React, { useState } from "react";
import { editIcon, questionIcon, redExlcaimationIcon, urgentFlag, viewHistoryIcon } from "../../../assets/icons";
import { programOptions, stabilityOptions, } from "../../../constant/array";
import { getChwOptions, getNumericDate, getProfileImage } from "../../../helpers";
import { getObjectiveValues } from "../../../helpers/objectiveValue";
import RenderUserPersonalDetail from "../RenderUserPersonalDetail";
import { updateClient } from "../../../redux/actions/user";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import reassessment from '../../../assets/images/reassessment.svg'
import { DownOutlined, SmileOutlined } from '@ant-design/icons';
import { Dropdown, Space } from 'antd';

const UserInfo = ({ singleUser, loggedInUser, programValue, objectiveValue, handleProgramValueChange, handleobjectiveChange, handleClickModal, chwList, handleChwSelect, filterOption, }) => {
    const { chwOptions } = useSelector((state) => state.user);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [btnLoading, setBtnLoading] = useState(false)
    const [imageUrl, setImageUrl] = useState("")
    const dispatch = useDispatch()

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const UserDetailInfoItem = ({ item }) => (
        <div className="visit-info w-100">
            <div className="heading bold600 black f-14">{getObjectiveValues(item?.label)}</div>
            <Select options={stabilityOptions} value={item?.value} onChange={(value) => handleobjectiveChange(value, item?.label)} />
        </div>
    );

    const handleProfileChanges = (e) => {
        if (e?.file.type.startsWith("image/")) {
            let payload = new FormData();
            payload.append("profileImage", e.file);
            dispatch(updateClient({ id: singleUser?._id, payload })).then((res) => {
                if (res?.payload?.status === true) {
                    message.success("Profile updated successfully!");
                } else {
                    message.error("Something went wrong");
                }
            });
        } else {
            message.error("Invalid file type. Please check your file and try again!")
        }
    };

    const handleChange = (info) => {
        if (info.file.status === "uploading") {
            return;
        }
        if (info.file.status === "done") {
            // Assuming your server returns the image URL    
            setImageUrl(info.file.response.url);
        } else if (info.file.status === "error") {
            message.error("Image upload failed.");
        }
    };

    const chwOpt = chwOptions.map((option) => {
        return { value: option.value, label: `${option.label} (${option.requestCount})` }
    })

    const handleReassessment = () => {
        setBtnLoading(true)
        const values = {};
        const reassessmentDate = dayjs().add(3, 'month').format('YYYY-MM-DD');
        values.reassessmentDate = reassessmentDate;
        values.isReassessment = false;

        dispatch(updateClient({ id: singleUser?._id, payload: values }))
            .then(() => {
                message.success("Reassessment date is updated successfully!");
                setIsModalVisible(false);
                setBtnLoading(false)
            })
            .catch((error) => {
                message.error("Failed to update user");
                console.error("Update error:", error);
            });
        setBtnLoading(false)
    };

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const items = [
        {
            key: '1',
            label: (
                <p>The last reassessment was 3 months ago. Reassessment is recommended.</p>
            ),
        },
        {
            key: '2',
            label: (
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: "flex-end" }}>
                    <Button onClick={showModal}> Reassess </Button>
                </div >
            )
        }
    ];

    return (
        <>
            <div className='user_profile_main'>
                <div className="profile">
                    <div className='avtar60'>
                        {
                            loggedInUser?.role === "CHW" ?
                                <img src={getProfileImage(singleUser)} alt="" />
                                :
                                <Upload
                                    name="avatar"
                                    accept="image/jpeg,image/jpg,image/png,image/avif,image/avi"
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    showUploadList={false}
                                    onChange={handleChange}
                                    customRequest={(e) => { handleProfileChanges(e); }}
                                >
                                    {imageUrl ?
                                        <img src={imageUrl} alt="Profile" style={{ width: "100%" }} />
                                        :
                                        <img src={getProfileImage(singleUser)} alt="" />
                                    }
                                </Upload>
                        }
                    </div>
                    <div className='profile-sec'>
                        <p className='profile-head'>{singleUser?.firstName}  {singleUser?.lastName} {!singleUser?.isDetailCompleted && <Tooltip title="Please fill all detail">{redExlcaimationIcon}</Tooltip>} {singleUser?.isReassessment && <Dropdown
                            menu={{
                                items,
                            }}
                            placement="bottom"
                        >
                            <a onClick={(e) => e.preventDefault()} style={{ margin: "auto" }}>
                                <img src={reassessment} style={{ height: "15px", margin: "auto", marginLeft: "10px" }} />
                            </a>
                        </Dropdown>}</p>
                        <p className='profile-des'>{singleUser?.userName}</p>
                    </div>
                </div>
                <div className='user_edit_profile' onClick={() => { handleClickModal("editClient", true, singleUser); }}>
                    <div className='edit-icon'>
                        {editIcon}
                    </div>
                </div>
            </div>
            <div className='user-detail-info'>
                <div className='contact-info w-50'>
                    <div className='heading f-14 black bold600'>Phone Number</div>
                    <div className='heading f-14 secondary60 bold400'>{singleUser?.Phone ? singleUser?.Phone : "-"} </div>
                </div>
                <div className='contact-info w-50'>
                    <div className='heading f-14 black bold600'>Email </div>
                    <div className='heading f-14 secondary60 bold400'>{singleUser?.email ? singleUser?.email : "-"} </div>
                </div>
                <div className='contact-info w-50'>
                    <div className='heading f-14 black bold600'>Birth Date </div>
                    <div className='heading f-14 secondary60 bold400'>{singleUser?.birthDate ? getNumericDate(singleUser?.birthDate) : "-"} </div>
                </div>
                <div className='contact-info  w-50'>
                    <div className='heading f-14 black bold600'>Address</div>
                    <div className='heading f-14 secondary60 bold400'>{singleUser?.address ? singleUser?.address : "-"} </div>
                </div>
                <div className='contact-info  w-50'>
                    <div className='heading f-14 black bold600 history-flag' onClick={() => handleClickModal("ClientStatusHistory", true, singleUser)}>Status {viewHistoryIcon} {!singleUser?.isActive && <Tooltip title="Probably inactive due to not answering call">{urgentFlag}</Tooltip>}</div>
                    <div className='heading f-14 secondary60 bold400'>
                        {singleUser?.status ? singleUser?.status : "-"}
                    </div>
                </div>
                <div className='contact-info  w-50'>
                    <div className='heading f-14 black bold600'>Zip Code</div>
                    <div className='heading f-14 secondary60 bold400'>{singleUser?.zipCode ? singleUser?.zipCode : "-"} </div>
                </div>
                <div className='contact-info  w-50'>
                    <div className='heading f-14 black bold600'>Created Date</div>
                    <div className='heading f-14 secondary60 bold400'>{singleUser?.createdAt ? dayjs(singleUser?.createdAt).format("MM/DD/YYYY") : "-"} </div>
                </div>
                {((loggedInUser?.role === "Super_Admin" ||
                    loggedInUser?.role === "Program_Administrator")) &&
                    <div className='contact-info w-100'>
                        <div className="heading f-14 black bold400">Community Health Worker Name</div>
                        <Select
                            placeholder="Assigned community health worker"
                            options={chwOpt}
                            onSelect={handleChwSelect}
                            showSearch
                            optionFilterProp="children"
                            filterOption={filterOption}
                            value={singleUser?.assign_to?.firstName !== undefined ? (singleUser?.assign_to?.firstName + " " + singleUser?.assign_to?.lastName) : "Assign Community Health Worker"}
                        />
                    </div>
                }
            </div>
            <div className="user-detail-info" >
                {singleUser?.profileQuestion?.length > 0 && singleUser?.profileQuestion
                    ?.slice()
                    ?.sort((a, b) => a?.question?.sequence - b?.question?.sequence)
                    ?.filter((item => item?.question?.selected === true))
                    ?.map((item, i) => {
                        const values = item?.question?.short_desc?.map((question) => question?.value);
                        const combinedTranslation = item?.answer?.map((ans) => ans?.answer)
                        return (
                            <React.Fragment key={i}>
                                <RenderUserPersonalDetail values={values} combinedTranslation={combinedTranslation} i={i} />
                            </React.Fragment>
                        )
                    })}
            </div>
            <div className="user-detail-info" >
                <div className="visit-info w-100 program">
                    <div className="heading f-14 bold600 black">Program:</div>
                    <Select options={programOptions} value={programValue} onChange={handleProgramValueChange} placeholder="Select program" />
                </div>
                <div className="objective">
                    <span>Non Medical Drivers of Health</span>
                    {(loggedInUser?.role === "Super_Admin" ||
                        loggedInUser?.role === "Program_Administrator") && <span onClick={() => handleClickModal("viewHistroyObject", true)}>{viewHistoryIcon}</span>}
                </div>
                {
                    objectiveValue?.map((objItem, i) => (
                        <React.Fragment key={i}>
                            <UserDetailInfoItem item={objItem} />
                        </React.Fragment>
                    ))
                }
            </div>
            <Modal
                // title="Reassessment Confirmation"
                open={isModalVisible}
                onOk={handleReassessment}
                onCancel={handleCancel}
                okText="Confirm"
                cancelText="Cancel"
                centered="true"
                confirmLoading={btnLoading}
                width={500}
            >
                <div className='inner_content' style={{ marginBottom: "20px" }}>
                    <div>{questionIcon}</div>
                    <div>
                        <p className='title'>Reassessment Confirmation </p>
                        {/* <p className='title'>{title}</p> */}
                        <span>Are you sure you want to set the reassessment date?</span>
                    </div>

                </div>

            </Modal>
        </>
    )
}
export default UserInfo