import React from 'react'
import { peopeleIcon } from '../../../../assets/icons'

export const UserCounters = ({ pendingUserCount, openUserCount, closedInactiveUserCount, closedSuccessUserCount }) => {
    return (
        <>
            <div className="dashboard">
                <div className="dashboard_task_wrapper" style={{ width: "100%" }}>
                    <div className="dashboard_table_wrapper" style={{width:'100%'}}>
                        <div className="dashboard_table_top">
                            <div className="task-sec" style={{ width: '24.75%', cursor:"auto" }}>
                                <div className='task-main'>
                                    <div className='task-main-left'>
                                        <h1 className='task_heading'>Pending Clients</h1>
                                        <h1 className='task_Count'>{pendingUserCount}</h1>
                                    </div>
                                    <div className='task-main-right'>
                                        <div className='curved-bg'>
                                            <svg width="74" height="98" viewBox="0 0 74 98" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M27.8434 37.1724C-7.87772 50.6897 -1.75696 83.3563 5.76856 98H74V0H49.9183C57.4438 6.75862 63.5646 23.6552 27.8434 37.1724Z" fill="#D5EFEA" />
                                            </svg>
                                            <span className='item-icon'>{peopeleIcon}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="task-sec" style={{ width: '24.75%', cursor:"auto" }}>
                                <div className='task-main'>
                                    <div className='task-main-left'>
                                        <h1 className='task_heading'>Open Clients</h1>
                                        <h1 className='task_Count'>{openUserCount}</h1>
                                    </div>
                                    <div className='task-main-right'>
                                        <div className='curved-bg'>
                                            <svg width="74" height="98" viewBox="0 0 74 98" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M27.8434 37.1724C-7.87772 50.6897 -1.75696 83.3563 5.76856 98H74V0H49.9183C57.4438 6.75862 63.5646 23.6552 27.8434 37.1724Z" fill="#D5EFEA" />
                                            </svg>
                                            <span className='item-icon'>{peopeleIcon}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="task-sec" style={{ width: '24.75%', cursor:"auto" }}>
                                <div className='task-main'>
                                    <div className='task-main-left'>
                                        <h1 className='task_heading'>Closed Success Clients</h1>
                                        <h1 className='task_Count'>{closedSuccessUserCount}</h1>
                                    </div>
                                    <div className='task-main-right'>
                                        <div className='curved-bg'>
                                            <svg width="74" height="98" viewBox="0 0 74 98" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M27.8434 37.1724C-7.87772 50.6897 -1.75696 83.3563 5.76856 98H74V0H49.9183C57.4438 6.75862 63.5646 23.6552 27.8434 37.1724Z" fill="#D5EFEA" />
                                            </svg>
                                            <span className='item-icon'>{peopeleIcon}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="task-sec" style={{ width: '24.75%', cursor:"auto" }}>
                                <div className='task-main'>
                                    <div className='task-main-left'>
                                        <h1 className='task_heading'>Closed Inactive Clients</h1>
                                        <h1 className='task_Count'>{closedInactiveUserCount}</h1>
                                    </div>
                                    <div className='task-main-right'>
                                        <div className='curved-bg'>
                                            <svg width="74" height="98" viewBox="0 0 74 98" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M27.8434 37.1724C-7.87772 50.6897 -1.75696 83.3563 5.76856 98H74V0H49.9183C57.4438 6.75862 63.5646 23.6552 27.8434 37.1724Z" fill="#D5EFEA" />
                                            </svg>
                                            <span className='item-icon'>{peopeleIcon}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
