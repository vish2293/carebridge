import { Upload, message } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { editIcon, exclamationIcon } from "../../assets/icons";
import Loader from "../../components/common/Loader";
import Search from "../../components/common/Search";
import AddChwAndClientModal from "../../components/modal/AddChwAndClientModal";
import { getProfileImage } from "../../helpers";
import { getAllRequest } from "../../redux/actions/request";
import { requestTaskByCHW } from "../../redux/actions/todo";
import { allChwClients, deleteUser, getSingleUser, searchChwClient, updateChw } from "../../redux/actions/user";
import { setActiveHeader } from "../../redux/slices/headerSlice";
import PACHWList from "./PACHWList";
import AddAndEditPAModal from "../../components/modal/AddAndEditPAModal";
import { getPAwiseCHW, getSinglePA, updatePA } from "../../redux/actions/programAdmin";

const ProgramAdminDetails = () => {
    const { PADetails, getPAwiseCHWData, singleUserLoading, loggedInUser } = useSelector((state) => state.programAdmin);
    const dispatch = useDispatch();
    const { id } = useParams();
    const [chwClientLists, setChwClientLists] = useState([]);
    const [modalAction, setModalAction] = useState("default");
    const [initialValues, setInitialValues] = useState({});
    const [opeDeleteModal, setOpenDeleteModal] = useState(false);
    const [imageUrl, setImageUrl] = useState("")
    const [pageNo, setPageMo] = useState(0)
    const [pageSize, setPageSize] = useState(25)
    const [chwId, setChwId] = useState("");

    const getChwDetail = (id) => {
        dispatch(getSinglePA(id));
    };

    useEffect(() => {
        dispatch(setActiveHeader({ name: "program_admin", heading: "Go back" }));
        localStorage.setItem("prevUrl", window.location.pathname);
    }, [])

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
        const payload = {
            search: "",
            id,
        };
        dispatch(getPAwiseCHW(payload));
    };

    useEffect(() => {
        getChwDetail(id);
        getAllClient(id);
    }, [id]);

    useEffect(() => {
        getallTask();
        getRequestLists();
    }, []);

    useEffect(() => {
        if (getPAwiseCHWData?.length > 0) {
            setChwClientLists(getPAwiseCHWData);
        } else {
            setChwClientLists([]);
        }
    }, [getPAwiseCHWData]);

    const handleProfileChanges = (e) => {
        if (e?.file.type.startsWith("image/")) {
            let payload = new FormData();
            payload.append("profileImage", e.file);
            dispatch(updateChw({ id: PADetails?._id, payload })).then((res) => {
                if (res?.payload?.status === true) {
                    message.success("Profile updated successfully!");
                    if (res.payload.data?.profileImage) {
                        setImageUrl(res.payload.data?.profileImage); 
                    }
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
            case "editPA":
                setModalAction(action);
                setInitialValues(data);
                break;
            case "deleteCHW":
                setModalAction(action);
                setChwId(data?.key);
                setOpenDeleteModal(isOpen);
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
            setImageUrl(info.file.response.url);
        } else if (info.file.status === "error") {
            message.error("Image upload failed.");
        }
    };

    const handleDispatchAction = (action, data) => {
        switch (action) {
            case "editPA":
                data.validateFields().then((values) => {
                    values.id = id
                    dispatch(updatePA({ payload: values })).then((res) => {
                        if (res?.payload?.status === true) {
                            modalClose();
                            getChwDetail(id);
                            message.success("Program Admins detail updated successfully!");
                        }
                    });
                });
                break;
        }
    };

    const handleSearch = (search) => {
        const payload = {
            search: search,
            id,
        };
        dispatch(getPAwiseCHW(payload))
    };

    const modalClose = () => {
        setModalAction("default");
    }

    return singleUserLoading ? <Loader className={'page-loader'} /> : (
        <>
            <div className='chw_detail_wrapper'>
                <div className='chw_detail_info'>
                    <div className='detail_header'>
                        <div className='heading f-14' style={{ fontWeight: "700" }}>Program Admin's Personal Details</div>
                        <div className='edit-icon' onClick={() => handleClickModal("editPA", true, PADetails)}>{editIcon}</div>
                    </div>
                    <div className='chw_personal_detail'>
                        <div className='profile'>
                            <div className='avtar60'>
                                {
                                    loggedInUser?.role === "Super_Admin" ?
                                        <img src={getProfileImage(PADetails)} alt="" />
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
                                                <img src={getProfileImage(PADetails)} alt="" />
                                            }
                                        </Upload>
                                }
                            </div>
                            <div>
                                <div className='heading f-14 secondary50' style={{ fontWeight: '700', color: "#333" }}>Name</div>
                                <div className='heading f-14 secondary90'>
                                    <p>{PADetails?.firstName}  {PADetails?.lastName ? PADetails?.lastName : "-"}</p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className='heading f-14 secondary50' style={{ fontWeight: '700', color: "#333" }}>Email</div>
                            <div className='heading f-14 secondary90'>{PADetails?.email ? PADetails?.email : "-"}</div>
                        </div>
                        <div className='phone'>
                            <div className='heading f-14 secondary50' style={{ fontWeight: '700', color: "#333" }}>Phone Number</div>
                            <div className='heading f-14 secondary90'>{PADetails?.Phone ? PADetails?.Phone : "-"}</div>
                        </div>
                        <div>
                            <div className='heading f-14 secondary50' style={{ fontWeight: '700', color: "#333" }}>Program</div>
                            <div className='heading f-14 secondary90'>
                                {Array.isArray(PADetails?.pa_program) && PADetails.pa_program.length > 0 ? (
                                    PADetails.pa_program
                                        .reduce((resultArray, item, index) => {
                                            const chunkIndex = Math.floor(index / 2);

                                            if (!resultArray[chunkIndex]) {
                                                resultArray[chunkIndex] = []; // Start a new chunk
                                            }

                                            resultArray[chunkIndex].push(item);

                                            return resultArray;
                                        }, [])
                                        .map((chunk, index) => (
                                            <div key={index}>{chunk.join(', ')}</div>
                                        ))
                                ) : (
                                    PADetails?.pa_program || "-"
                                )}
                            </div>
                        </div>
                        <div>
                            <div className='heading f-14 secondary50' style={{ fontWeight: '700', color: "#333" }}>Zip Code</div>
                            <div className='heading f-14 secondary90'>{PADetails?.zipCode ? PADetails?.zipCode : "-"}</div>
                        </div>
                        <div>
                            <div className='heading f-14 secondary50' style={{ fontWeight: '700', color: "#333" }}>Address</div>
                            <div className='heading f-14 secondary90'>{PADetails?.address ? PADetails?.address : "-"}</div>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="status-sec">
                        <div className="status-sec-left">
                            <div className='dashboard-heading'>CHW's details</div>
                        </div>
                        <div className="status-sec-right">
                            <Search
                                handleOnChangeSearch={handleSearch}
                                placeholder={"Search Users"}
                            />
                        </div>
                    </div>
                    <PACHWList
                        chwClientLists={chwClientLists}
                        id={id}
                        handleClickModal={handleClickModal}
                        handleDispatchAction={handleDispatchAction}
                        isOpen={opeDeleteModal}
                        setIsOpen={setOpenDeleteModal}
                    />
                </div>
            </div>
            <AddAndEditPAModal
                isOpen={modalAction === "editPA"}
                modalClose={modalClose}
                initialValues={initialValues}
                handleSubmit={handleDispatchAction}
                modalAction={modalAction}
            />

        </>
    );
};
export default ProgramAdminDetails;