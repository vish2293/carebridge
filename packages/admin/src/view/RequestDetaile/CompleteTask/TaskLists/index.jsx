/* eslint-disable react/prop-types */
import { changeDateTime } from "../../../../helpers";
import { Select } from "antd";
import { TaskStatusOptions } from "../../../../constant/array";
import { useSelector } from "react-redux";

const TaskLists = ({ item, setPayload, payload, setIsConfirmTask }) => {

  const { requestDetaile } = useSelector((state) => state.request);

  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  return (
    <div className={`content task-${item?.status}`}>
      <div className='content-left'>
        <div className='heading f-14 bold400 black'>{item?.task?.task_name}</div>
        <div className='heading f-14 bold400 secondary60'>{item?.task?.task_description}</div>
      </div>
      <div className='content-right'>
        <div className='heading f-14 bold400 black'>{changeDateTime(item?.dueDate)}</div>
        {
          requestDetaile?.request_status !== "Completed" && <div className='select-task'>
            <Select
              value={item?.status ? item?.status : payload?.status}
              options={TaskStatusOptions}
              onSelect={(value) => {
                setPayload({ taskClientId: item?._id, status: value })
                setIsConfirmTask(true)
              }
              }
              showSearch
              optionFilterProp="children"
              filterOption={filterOption}
            />
          </div>
        }
      </div>
    </div>
  );
};

export default TaskLists;
