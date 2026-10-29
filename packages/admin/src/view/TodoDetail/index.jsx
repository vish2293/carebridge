import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { getSingleTask, updateSingleTask } from "../../redux/actions/todo";
import { useSelector } from "react-redux";
import { getFullDateTime, getVisitDate } from "../../helpers";
import { Button, message } from "antd";
import EditTaskModal from "./EditTask";
import dayjs from "dayjs";
import UserInfo from "../UserDetaile/UserInfo";
import { getSingleUser, updateClient } from "../../redux/actions/user";
import ConfirmChwModal from "../../components/modal/ConfirmChwModal";
import AddChwAndClientModal from "../../components/modal/AddChwAndClientModal";
import { initialObjectiveValue } from "../../constant/array";

const TodoDetail = () => {
    const { singleTodo } = useSelector((state) => state.todo);
    const { singleUser, chwList, loggedInUser } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const { id } = useParams();
    const [openEditTask, setOpenEditTask] = useState(false);
    const [modaAction, setModalAction] = useState("");
    const [initialValues, setInitialValues] = useState({});
    const [programValue, setProgramValue] = useState("");
    const [chwId, setChwId] = useState("");
    const [acceptChw, setAcceptChw] = useState(false);
    const [openUserEdit, setOpenUserEdit] = useState(false);
    const [objectiveValue, setObjectiveValue] = useState(initialObjectiveValue);
    const [chwName, setChwName] = useState("");

    useEffect(() => {
        dispatch(getSingleTask({ id }))
    }, [id])

    //For accept chw
    const handleConfirmChw = () => {
        const payload = {
            assign_to: chwId,
            isChw_Assign: true,

        };
        dispatch(updateClient({ id, payload })).then(() => {
            setAcceptChw(false);
            message.success("Community Health Worker assigned successfully!");
        });
    };

    //For get single user details
    const getSignleUserDetail = (id) => {
        dispatch(getSingleUser({ id }));
    };

    useEffect(() => {
        getSignleUserDetail(singleTodo?.clientId?._id);
    }, [singleTodo?.clientId?._id]);

    useEffect(() => {
        if (singleUser?.objective?.length > 0) {
            setObjectiveValue(singleUser?.objective);
        }
        setProgramValue(singleUser?.program);
    }, [singleUser]);

    const handleProgramValueChange = (value) => {
        if (value) {
            setProgramValue(value)
        }
        dispatch(updateClient({ id: singleTodo?.clientId?._id, payload: { program: value } }))
    }
    const filterOption = (input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
    //For handle select
    const handleChwSelect = (values, option) => {
        setChwId(values);
        setChwName(option?.label);
        setAcceptChw(true);
    };

    const handleobjectiveChange = (value, label) => {
        if (value) {
            const newObj = [...objectiveValue];
            const index = newObj.findIndex((objItem) => objItem.label === label);
            newObj[index] = { ...newObj[index], value }; // Update the value property of the object
            setObjectiveValue(newObj);
            dispatch(updateClient({ id: singleTodo?.clientId?._id, payload: { objective: [{ label: label, value: value }] } }))
        }
    };

    const handleClickModal = (action, isOpen, data) => {
        switch (action) {
            case "editTask":
                setModalAction(action);
                setOpenEditTask(isOpen);
                setInitialValues({
                    category: data?.task?.category,
                    task_name: data?.task?.task_name,
                    status: data?.task?.status,
                    task_description: data?.task?.task_description,
                    dueDate: dayjs(data?.dueDate)
                })
                break;
            case "editClient":
                setOpenUserEdit(isOpen);
                setModalAction(action);
                setInitialValues(data);
                break;
            default:
                break;
        }
    }
    const handleDispatchAction = (action, data) => {
        switch (action) {
            case "editTask":
                data.validateFields().then((values) => {
                    values.id = id;
                    values.task = {
                        task_name: values.task_name,
                        task_description: values.task_description,
                        category: values.category,
                        status: values.status
                    };
                    dispatch(updateSingleTask({ id, payload: values })).then((res) => {
                        if (res?.payload?.status === true) {
                            setOpenEditTask(false);
                        }
                    });
                });
                break;
            case "editClient":
                data.validateFields().then((values) => {
                    dispatch(updateClient({ id: singleTodo?.clientId?._id, payload: values })).then(() => {
                        setOpenUserEdit(false);
                    });
                });
                break;
        }
    }
    return (
        <>

            <div className='user_detail_wrapper visit_detail'>
                <div className='user_detail_left'>
                    <UserInfo
                        singleUser={singleUser}
                        chwList={chwList}
                        objectiveValue={objectiveValue}
                        programValue={programValue}
                        handleProgramValueChange={handleProgramValueChange}
                        handleobjectiveChange={handleobjectiveChange}
                        filterOption={filterOption}
                        handleChwSelect={handleChwSelect}
                        handleClickModal={handleClickModal}
                        loggedInUser={loggedInUser}
                    />
                </div>
                <div className='user_detail-right'>
                    <div className="addivisit">
                        <div className="form-head">Important Dates Detail</div>

                        <div className="user-detail-info">
                            <div class="contact-info w-50">
                                <div class="heading f-14 black bold600">Category </div>
                                <div class="heading f-14 secondary60 bold400">{singleTodo?.task?.category}</div>
                            </div>
                            <div class="contact-info w-50">
                                <div class="heading f-14 black bold600">Name </div>
                                <div class="heading f-14 secondary60 bold400">{singleTodo?.task?.task_name}</div>
                            </div>
                            {/* <div class="contact-info w-50">
                                <div class="heading f-14 black bold600">Description </div>
                                <div class="heading f-14 secondary60 bold400">{singleTodo?.task?.task_description}</div>
                            </div> */}
                            <div class="contact-info w-50">
                                <div class="heading f-14 black bold600">Client name </div>
                                <div class="heading f-14 secondary60 bold400">{`${singleTodo?.clientId?.firstName} ${singleTodo?.clientId?.lastName}`}</div>
                            </div>
                            <div class="contact-info w-50">
                                <div class="heading f-14 black bold600">Due date</div>
                                <div class="heading f-14 secondary60 bold400">{getFullDateTime(singleTodo?.dueDate)}</div>
                            </div>
                        </div>

                        <div className="accept-reject">
                            <Button onClick={() => handleClickModal("editTask", true, singleTodo)}>Edit</Button>
                        </div>
                    </div>
                </div>
            </div>
            {
                openUserEdit &&
                <AddChwAndClientModal
                    isOpen={openUserEdit}
                    setIsOpen={setOpenUserEdit}
                    modalAction={modaAction}
                    handleSubmit={handleDispatchAction}
                    initialValues={initialValues}
                />
            }
            {
                openEditTask &&
                <EditTaskModal
                    isOpen={openEditTask}
                    setIsOpen={setOpenEditTask}
                    data={initialValues}
                    modalAction={modaAction}
                    handleDispatchAction={handleDispatchAction}
                />
            }
            {
                acceptChw &&
                <ConfirmChwModal
                    isOpen={acceptChw}
                    setIsOpen={setAcceptChw}
                    handleOnOk={handleConfirmChw}
                    chwName={chwName}

                />
            }
        </>

    )
}
export default TodoDetail