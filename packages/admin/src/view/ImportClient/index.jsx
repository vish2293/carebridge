import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { setActiveHeader } from "../../redux/slices/headerSlice"
import ImportedClientList from "./ImportedClientList"
import Papa from "papaparse";
import { Button, Upload, message, } from "antd"
import { deleteUser, getCsvClient, importCsvClient } from "../../redux/actions/user"
import ImportMessage from "./ImportMessage"
import { useSelector } from "react-redux"
import DeleteModal from "../../components/modal/DeleteModal"
import { questionIcon } from "../../assets/icons"
import { capitalizeFirstLetter } from "../../helpers/capitalizeFirstLetter"
import Loader from "../../components/common/Loader"

const ImportClient = () => {
    const { csvUser, csvUserLoading } = useSelector((state) => state.user)
    // For dispatch
    const dispatch = useDispatch()
    // For navigate
    const navigate = useNavigate()
    // For store imported client
    const [clientList, setClientList] = useState([])
    // For store error
    const [openSuccess, setOpenSuccess] = useState(false)
    // For store response data
    const [resData, setResData] = useState({})
    // For import loading
    const [importLoading, setImportLoading] = useState(false)
    const [modaAction, setModalAction] = useState("")
    const [openDelete, setOpenDelete] = useState(false)
    const [initialValues, setInitialValues] = useState({})

    useEffect(() => {
        dispatch(setActiveHeader({ name: "importClient", heading: "Import client" }))
        dispatch(getCsvClient())
        localStorage.setItem("prevUrl", window.location.pathname);
    }, [])

    useEffect(() => {
        if (csvUser?.length > 0) {
            setClientList(csvUser)
        } else {
            setClientList([])
        }
    }, [csvUser])

    function getEmptyFieldKeys(data) {
        const emptyFieldKeys = [];

        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                const value = data[key];
                if (value === '' || value === null || value === undefined) {
                    emptyFieldKeys.push(key);
                }
            }
        }
        return emptyFieldKeys;
    }

    const handleFileUpload = (info) => {
        // setImportDrower(true);
        if (info.file?.type === "text/csv") {
            if (info?.file) {
                Papa.parse(info?.file, {
                    delimiter: "",
                    chunkSize: 3,
                    header: false,
                    complete: async function (responses) {
                        const filterResponse = responses?.data?.filter((item) => item?.length > 1)
                        const successData = []
                        const errorData = []

                        for (let i = 1; i < filterResponse.length; i++) {
                            // Check if the line contains only empty values
                            if (filterResponse[i].every(value => value === "")) {
                                continue; // Skip this line
                            }

                            const obj = {};
                            const errorObj = {};

                            // Iterate over the indices of the keys array
                            for (let j = 0; j < filterResponse[0].length; j++) {
                                // Remove any leading/trailing whitespace from the key
                                const key = filterResponse[0][j].trim()?.split("/")[0]?.trim().split(":")[0].trim();
                                const values = filterResponse[i][j].trim()?.split("/")[0]?.trim();
                                if ((key === 'First Name' && (values === '' || values === undefined)) || (key === 'Last Name' && (values === '' || values === undefined)) || (key === 'Phone Number' && (values === '' || values === undefined))) {
                                    const arr = [];
                                    if (!errorObj[key]) {
                                        errorObj[key] = [];
                                    }
                                    errorObj[key].push(values);
                                }

                                if (key !== "" && key !== undefined) {
                                    // Add key-value pair to the object
                                    if (key === "CHW" || key === "First Name" || key === "Last Name" || key === "Phone Number" || key === "Email Address" || key === "Zip Code") {
                                        obj[key] = filterResponse[i][j].trim()?.split("/")[0]?.trim()
                                    } else if (key === "How did you hear about us?") {
                                        obj[key] = [`${filterResponse[i][j]?.trim()} `, ""]
                                    }
                                    else if (key === "Date of Birth") {
                                        obj[key] = [filterResponse[i][j]?.trim(), ""]
                                    }
                                    else if (filterResponse[i][j].trim()?.includes("/")) {
                                        obj[key] = filterResponse[i][j].trim()?.split("/")?.map((item) => item?.trim())
                                    } else {
                                        obj[key] = [`${filterResponse[i][j]?.trim()} `, '']
                                    }
                                }
                            }

                            // Process errorObj to generate missing field data
                            const errorArr = [];
                            for (const key of Object.keys(errorObj)) {
                                errorObj[key].forEach((value, index) => {
                                    errorArr.push({ field: capitalizeFirstLetter(key), value });
                                });
                            }

                            // Push the object to the result array
                            if (Object.keys(errorObj).length > 0) {
                                errorData.push({ lineNo: i + 1, missingFields: errorArr });
                            } else {
                                successData.push(obj);
                            }
                        }

                        const csvPayload = {
                            data: [{
                                successData,
                                errorData
                            }]
                        }
                        setImportLoading(true)
                        dispatch(importCsvClient({ payload: csvPayload })).then((res) => {
                            if (res?.payload?.status === true) {
                                const tempData = [...clientList]
                                setImportLoading(false)
                                dispatch(getCsvClient())
                                setOpenSuccess(true)
                                setResData(res?.payload?.data)
                            }
                        })
                    }
                });
            }
        } else {
            message.error("Please import csv file")
        }
    };


    //For handle delete
    const handleClickModal = (action, isOpen, data) => {
        switch (action) {
            case "deleteClient":
                setInitialValues(data)
                setModalAction(action)
                setOpenDelete(isOpen)
                break;
            default:
                break;
        }
    }
    // 
    const handleDispatchAction = (action, data) => {
        switch (action) {
            case "deleteClient":
                dispatch(deleteUser({ id: initialValues?.key })).then((res) => {
                    const tempClient = [...clientList]
                    const index = tempClient?.findIndex((userData) => userData?._id === res?.payload?.data?._id);
                    tempClient?.splice(index, 1)
                    setClientList(tempClient)
                    setOpenDelete(false)
                    message.success("Client deleted successfully!")
                })
                break;
            default:
                break;
        }
    }

    const props = {
        beforeUpload: (file) => {
            if (
                !['text/csv'].includes(file.type)

            ) {
                message.error('Please upload file with ".csv" formats');
                return Upload.LIST_IGNORE;
            }
            return false;
        },
        name: 'file',
        multiple: false,
        listType: 'file',
        showUploadList: false,
        onChange: handleFileUpload,
    };
    return csvUserLoading ? <Loader className={'page-loader'} /> : (
        <>
            <div className="user_wrapper">
                <div className='status-sec'>
                    <div className='status-sec-left'>
                        <div className="dashboard-heading">All Imported Clients</div>
                    </div>
                    <div className='status-sec-right'>
                        <Upload {...props}>
                            <Button type="primary" className="yellow-btn">
                                Import from CSV
                            </Button>
                        </Upload>
                    </div>
                </div>
                <div className='dashboard_table_wrapper'>
                    <ImportedClientList
                        importLoading={importLoading || csvUserLoading}
                        clientList={clientList}
                        handleClickModal={handleClickModal}
                    />
                </div>
            </div >
            {
                openSuccess &&
                <ImportMessage isOpen={openSuccess} setIsOpen={setOpenSuccess} resData={resData} />
            }
            {
                openDelete &&
                <DeleteModal
                    isOpen={openDelete}
                    setIsOpen={setOpenDelete}
                    icon={questionIcon}
                    title={"Delete Client"}
                    description={"This client and it’s detail will be deleted permanently !"}
                    modalAction={modaAction}
                
                    handleDispatchAction={handleDispatchAction}
                />
            }
        </>
    )
}
export default ImportClient