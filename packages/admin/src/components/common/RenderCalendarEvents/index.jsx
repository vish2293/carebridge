import React from "react";
import dayjs from "dayjs";
import { Popover } from "antd";

const RenderCalendarEvents = (eventInfo) => {
    const { dueDate, category, userName, status } = eventInfo?.event?._def?.extendedProps || {};

    const content = (
        <div style={{ textAlign: 'left' }}>
            {eventInfo?.event?.extendedProps?.isOverdue && <p style={{ color: 'red' }}><strong>Over Due</strong></p>}
            <p><strong>Client Name:</strong> {userName}</p>
            <p><strong>Task Name:</strong> {eventInfo?.event?.title}</p>
            <p><strong>Category:</strong> {
                category?.length
                    ? category.map((need, index) => (
                        <span key={need}>
                            {need}
                            {index < category.length - 1 && ', '}
                        </span>
                    ))
                    : "-"
            }  </p>
            <p><strong>Status:</strong> {status}</p>
            <p><strong>Due Date:</strong> {dayjs(dueDate).format('MM/DD/YYYY')}   {eventInfo?.timeText}</p>
        </div>
    );

    return (
        <Popover content={content} title="Task Details">
            <div className={`${eventInfo?.event?.extendedProps?.isOverdue ? "past-due" : "comming-events"}`}>
                <div>
                    {eventInfo?.event?.extendedProps?.isOverdue && <span className="over-due">Over Due</span>}
                    <span>{eventInfo?.timeText}</span>
                </div>
                <span>
                    {eventInfo?.event?.title?.length > 15
                        ? eventInfo?.event?.title?.slice(0, 15) + "..."
                        : eventInfo?.event?.title}
                </span>
            </div>
        </Popover>
    );
}

export default RenderCalendarEvents;
