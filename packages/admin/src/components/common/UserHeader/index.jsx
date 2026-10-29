import { Dropdown } from "antd";
import {
  auditLogsIcon,
  hamburger,
  leftArrow,
  menuDropDownIcon,
} from "../../../assets/icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PATH_LIST } from "../../../constant/path-list";
import { logoutIcon } from "../../../assets/icons";
import { profileIcon } from "../../../assets/icons";
import { getUserRole } from "../../../helpers";
import logo from "../../../assets/images/Logo.svg";
import { setActiveSidebar } from "../../../redux/slices/headerSlice";

const UserHeader = () => {
  //For reducer
  const { loggedInUser } = useSelector((state) => state.user);
  const { headerValue } = useSelector((state) => state.header);
  //For navigate
  const navigate = useNavigate();
  //For dispatch
  const dispatch = useDispatch();

  const getProfileImage = () => {
    const S3_BASE_URL = import.meta.env.VITE_APP_S3_BASE_URL;

    if (loggedInUser?.profileImage) {
      return loggedInUser.profileImage.startsWith('http') ? loggedInUser.profileImage : S3_BASE_URL + loggedInUser.profileImage; // uploads are stored as full URLs
    } else {
      const initials =
        (loggedInUser?.firstName?.charAt(0) || "") +
        (loggedInUser?.lastName?.charAt(0) || "");
      return `https://ui-avatars.com/api/?name=${initials}&background=random`;
    }
  };

  //For logout
  const logOut = () => {
    localStorage.removeItem("token");
    navigate(PATH_LIST.login);
  };

  //For toogle side bar
  const handleToggleSideBar = () => {
    dispatch(setActiveSidebar(true));
  };

  const items = [
    {
      label: <p>Profile</p>,
      key: "0",
      onClick: () => navigate(`/app/users/profile/${loggedInUser?._id}`),
      icon: <span>{profileIcon}</span>,
    },
    {
      type: "divider",
    },
    {
      label: <p>Audit Logs</p>,
      key: "1",
      onClick: () => navigate("/app/users/audit-logs"),
      icon: <span>{auditLogsIcon}</span>,
    },
    {
      type: "divider",
    },
    {
      label: <p className="logout">Log Out</p>,
      key: "2",
      onClick: () => logOut(),
      icon: <span>{logoutIcon}</span>,
    },
  ];

  return (
    <header className="user_header">
      <div className="user_header_wrapper">
        <div
          className="logo"
          onClick={() => navigate(PATH_LIST.user.dashboard)}
        >
          <img src={logo} alt="" />
        </div>
        <div className="user_header_left">
          {headerValue.heading == "Go back" ? (
            <h2>
              <span onClick={() => navigate(-1)}>{leftArrow}</span>
              Go back
            </h2>
          ) : headerValue.heading == "Dashboard" ? (
            <h2>Welcome, {loggedInUser?.firstName}</h2>
          ) : (
            <h2>{headerValue.heading}</h2>
          )}
          {/* {
            headerValue?.name === "dashboard" ?
              <>
                <h2>Welcome, {loggedInUser?.firstName}</h2>
              </>
              :
              <h2>
                {
                  (headerValue?.heading === "View Client" || headerValue?.heading === "View CHW" || headerValue?.heading === "Go back" || headerValue?.heading === "View Visitors" || headerValue?.heading === "All Visits") && <span onClick={() => navigate(-1)}>{leftArrow}</span>
                }
                {headerValue?.heading}
              </h2>
          } */}
        </div>
        <div className="user_header_right">
          <div className="user-dropdown">
            <Dropdown
              overlayClassName="header-profile-dropdown"
              placement="bottomRight"
              menu={{ items }}
              trigger={["click"]}
            >
              <a onClick={(e) => e.preventDefault()}>
                <div className="profile">
                  <div className="avtar40">
                    <img src={getProfileImage()} alt="" />
                  </div>
                  <div className="profile-sec">
                    <p className="profile-head">
                      <span>{loggedInUser?.firstName}</span>
                      <span>{loggedInUser?.lastName}</span>
                      <span className="dropdown">{menuDropDownIcon}</span>
                    </p>
                    <p className="profile-des">
                      {getUserRole(loggedInUser?.role)}
                    </p>
                  </div>
                </div>
              </a>
            </Dropdown>
          </div>
          <div onClick={handleToggleSideBar} className="hamburger">
            {hamburger}
          </div>
        </div>
      </div>
    </header>
  );
};

export default UserHeader;
