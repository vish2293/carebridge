import { DatePicker } from "antd"
import { disabledDate } from "../../../helpers";

const RangeDateTime = ({ handleDateTimeRange, value }) => {

    const onChangeDateTime = (value) => {
        if (value) {
            handleDateTimeRange(value);
        };
    };

    return (
        <DatePicker.RangePicker value={value} onChange={onChangeDateTime} disabledDate={(value) => disabledDate(value, "futureDate")} format={'MM/DD/YYYY'} style={{ width: "250px" }} allowClear={false} />
    );
}
export default RangeDateTime