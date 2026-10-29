import { useNavigate } from "react-router-dom"
import { peopeleIcon } from "../../../assets/icons"
import { PATH_LIST } from "../../../constant/path-list"
import { Skeleton } from "antd";
import { useSelector } from "react-redux";

const DashboardCards = ({ title, count }) => {
    const { requestLoading } = useSelector((state) => state.request)
    const navigate = useNavigate();

    const handleClick = (title) => {
        navigate(`${PATH_LIST.user.users}?status=${title === "activeClient" ? "Open" : "Pending"}`);
    };

    return (
        <div className='task-main' onClick={() => handleClick(title)}>
            <div className='task-main-left'>
                <h1 className='task_heading'>{title === "activeClient" ? "Active Clients" : title === "newClient" ? "New Clients" : "-"}</h1>
                <h1 className='task_Count'>{count}</h1>
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
    );
};


export default DashboardCards