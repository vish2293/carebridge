import { Popover } from 'antd'
import React from 'react'

const RenderEvents = (data) => {

  return (
    <Popover>
      <div>
        {data?.map((task) => (
          <div key={task?._id}>
            <div>{task?.task_name}</div>
            <div>{task?.dueDate}</div>
          </div>
        ))}
      </div>
    </Popover>
  )
}
export default RenderEvents
