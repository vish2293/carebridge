import { Upload, message } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { editIcon } from "../../assets/icons";
import Loader from "../../components/common/Loader";
import Search from "../../components/common/Search";
import AddChwAndClientModal from "../../components/modal/AddChwAndClientModal";
import { getProfileImage } from "../../helpers";
import { getAllRequest } from "../../redux/actions/request";
import { requestTaskByCHW } from "../../redux/actions/todo";
import { allChwClients, getSingleUser, searchChwClient, updateChw } from "../../redux/actions/user";
import { setActiveHeader } from "../../redux/slices/headerSlice";
import ChwClientLists from "./ChwClientLists";
import "./style.scss";

const ChwDetaile = () => {
    const { singleUser, chwClientList, singleUserLoading, loggedInUser } = useSelector((state) => state.user);
    const { requestList } = useSelector((state) => state.request);
    const { userRequestTodoList } = useSelector((state) => state.todo);
    const dispatch = useDispatch();
    const { id } = useParams();
    const [chwClientLists, setChwClientLists] = useState([]);
    const [modalAction, setModalAction] = useState("default");
    const [initialValues, setInitialValues] = useState({});
    const [imageUrl, setImageUrl] = useState("")
    const [pageNo, setPageMo] = useState(0)
    const [pageSize, setPageSize] = useState(25)

    const getChwDetail = (id) => {
        dispatch(getSingleUser({ id }));
    };

    const getRequestLists = () => {
        let payload = {
            filter: { search: "", status: "" },
            pagination: { page: pageNo || 1, limit: pageSize || 25 }
          };
        dispatch(getAllRequest(payload));
    };

    const getallTask = () => {
        dispatch(requestTaskByCHW({ payload: '' }))
    };

    const getAllClient = (id) => {
        dispatch(allChwClients({ id }));
    };

    useEffect(() => {
        dispatch(setActiveHeader({ name: "CHW", heading: "Go back" }));
    }, []);

    useEffect(() => {
        getChwDetail(id);
        getAllClient(id);
    }, [id]);

    useEffect(() => {
        getallTask();
        getRequestLists();
    }, []);

    useEffect(() => {
        if (chwClientList?.length > 0) {
            setChwClientLists(chwClientList);
        } else {
            setChwClientLists([]);
        }
    }, [chwClientList]);

    const handleProfileChanges = (e) => {
        if (e?.file.type.startsWith("image/")) {
            let payload = new FormData();
            payload.append("profileImage", e.file);
            dispatch(updateChw({ id: singleUser?._id, payload })).then((res) => {
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

    const handleClickModal = (action, isOpen, data) => {
        switch (action) {
            case "editChw":
                setModalAction(action);
                setInitialValues(data);
                break;
            default:
                break;
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

    const handleDispatchAction = (action, data) => {
        switch (action) {
            case "editChw":
                data.validateFields().then((values) => {
                    dispatch(updateChw({ id: id, payload: values })).then((res) => {
                        if (res?.payload?.status === true) {
                            modalClose();
                            message.success("Community Health Worker detail updated successfully!");
                        }
                    });
                });
                break;
            default:
                break;
        }
    };


    const handleSearch = (search) => {
        dispatch(searchChwClient({ search, id }))
    };
    const modalClose = () => {
        setModalAction("default");
    }

    return singleUserLoading ? <Loader className={'page-loader'} /> : (
        <>
            <div className='chw_detail_wrapper'>
                <div className='chw_detail_info'>
                    <div className='detail_header'>
                        <div className='heading f-14'>Community Health Worker Personal Detail</div>
                        <div className='edit-icon' onClick={() => handleClickModal("editChw", true, singleUser)}>{editIcon}</div>
                    </div>
                    <div className='chw_personal_detail'>
                        <div className='profile'>
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
                            <div>
                                <div className='heading f-14 secondary50'>Name</div>
                                <div className='heading f-14 secondary90'>
                                    <p>{singleUser?.firstName}  {singleUser?.lastName ? singleUser?.lastName : "-"}</p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className='heading f-14 secondary50'>Email</div>
                            <div className='heading f-14 secondary90'>{singleUser?.email ? singleUser?.email : "-"}</div>
                        </div>
                        <div className='phone'>
                            <div className='heading f-14 secondary50'>Phone Number</div>
                            <div className='heading f-14 secondary90'>{singleUser?.Phone ? singleUser?.Phone : "-"}</div>
                        </div>
                        <div>
                            <div className='heading f-14 secondary50'>Zip Code</div>
                            <div className='heading f-14 secondary90'>{singleUser?.zipCode ? singleUser?.zipCode : "-"}</div>
                        </div>
                        <div>
                            <div className='heading f-14 secondary50'>Address</div>
                            <div className='heading f-14 secondary90'>{singleUser?.address ? singleUser?.address : "-"}</div>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="status-sec">
                        <div className="status-sec-left">
                            <div className='dashboard-heading'>Community Health Worker’s Client detail</div>
                        </div>
                        <div className="status-sec-right">
                            <Search
                                handleOnChangeSearch={handleSearch}
                                placeholder={"Search Users"}
                            />
                        </div>
                    </div>
                    <ChwClientLists
                        chwClientLists={chwClientLists}
                        id={id}
                    />
                </div>
            </div >
            <AddChwAndClientModal
                isOpen={modalAction === "editChw"}
                modalClose={modalClose}
                initialValues={initialValues}
                handleSubmit={handleDispatchAction}
                modalAction={modalAction}
            />
        </>
    );
};
export default ChwDetaile;