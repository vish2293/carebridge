import { Progress } from 'antd'
import React from 'react'

const TaskProgress = ({requestTasks}) => {
const CompletedTask=requestTasks?.filter((v)=>v?.status==="Completed")
const percentageCompleted = (CompletedTask.length / requestTasks.length) * 100;
  return (
    <>
      <Progress percent={percentageCompleted} format={()=>`${CompletedTask?.length} of ${requestTasks?.length}`}/>
    </>
  )
}

export default TaskProgress
