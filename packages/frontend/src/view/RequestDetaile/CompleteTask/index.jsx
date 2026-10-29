/* eslint-disable react/prop-types */
import TaskProgress from "./TaskProgress";
import TaskLists from "./TaskLists";

const CompleteTask = ({ requestTasks, setPayload, payload, setIsConfirmTask, handleCompleteTask }) => {

  return (
    <div>
      <div className='task-progress'>
        <div className='dashboard-heading'>Task to do</div>
        <TaskProgress requestTasks={requestTasks} />
        {/* <Button className='tag green-brd'>Add more task</Button> */}
      </div>
      <div className='task_list'>
        {
          requestTasks?.map((item) => (
            <div className='inner_content' key={item?._id}>
              <TaskLists item={item} payload={payload} setPayload={setPayload} setIsConfirmTask={setIsConfirmTask} handleCompleteTask={handleCompleteTask} />
            </div>

          ))
        }
      </div>
    </div>
  );
};

export default CompleteTask;
