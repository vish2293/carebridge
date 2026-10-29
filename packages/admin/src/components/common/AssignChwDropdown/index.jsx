import { Select } from "antd"
import { useState } from "react"
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { getChwOptions } from "../../../redux/actions/user";

const AssignCHWDropdown = ({ className, handleClickModal, setByCHW, all, value, setMultipleChw, setChwName, record }) => {
    const { chwOptions } = useSelector((state) => state.user);
    const { Option } = Select;
    const [debounceTimeout, setDebounceTimeout] = useState(null);
    const dispatch = useDispatch();

    const onSearch = (value) => {
        clearTimeout(debounceTimeout);
        const time = setTimeout(() => {
            dispatch(getChwOptions({ search: value }));
        }, 500);
        setDebounceTimeout(time);
    }

    const handleOnChange = (value, option) => {
        if (setByCHW) {
            setByCHW(value);
        }
        else if (setChwName && record) {
            handleClickModal("confirmCHW", "", option, record?.key);
        }
        else if (setMultipleChw) {
            setMultipleChw(value);
            handleClickModal("confirmCHW", "", option);
        }
    }
    const chwOpt = chwOptions.map((option) => {
        return { value: option.value, label: `${option.label} (${option.requestCount})` }
    })

    const modifiedChwOptions = all
        ? [{ value: "", label: "All" }, ...chwOpt]
        : chwOpt
    return (
        <Select placeholder="Select Community Health Worker" onChange={handleOnChange} className={className} showSearch onSearch={onSearch} filterOption={false} value={value}>
            {
                modifiedChwOptions?.map((option => (
                    <Option key={option?.value} value={option?.value}>
                        {option?.label}
                    </Option>
                )))
            }
        </Select>
    )
}
export default AssignCHWDropdown