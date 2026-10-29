import { useEffect, } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { leftArrow } from "../../assets/icons";
import Loader from "../../components/common/Loader";
import SideBar from "../../components/common/SideBar";
import UserHeader from "../../components/common/UserHeader";
import { PATH_LIST } from "../../constant/path-list";
import { getAppearance } from "../../redux/actions/appearance";
import { getLoginUserDetails } from "../../redux/actions/user";
import { message } from "antd";

const Layout = () => {
    const { loggedInUserLoading, loggedInUser } = useSelector((state) => state.user);
    const { sideBarValue, headerValue } = useSelector((state) => state.header);
    const { appearanceList, appearanceLoading } = useSelector((state) => state.appearance);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    const getUserDetails = (token) => {
        dispatch(getLoginUserDetails({ token })).then((res) => {
            if (res?.payload?.message === "Unauthorized User") {
                localStorage.clear("token");
                localStorage.clear("prevUrl");
                navigate(PATH_LIST.login);
            }
        });
    };

    const getAppearanceList = (role) => {
        // if (role === "Program_Administrator") {
        dispatch(getAppearance())
        // }
    }

    useEffect(() => {
        getUserDetails(token);
    }, [token]);

    useEffect(() => {
        getAppearanceList(loggedInUser?.role)
    }, [loggedInUser?.role])

    useEffect(() => {
        // if (loggedInUser?.role === "Program_Administrator") {
        document.documentElement.style.setProperty('--yellow-btn', appearanceList?.buttonColor?.primary);
        document.documentElement.style.setProperty('--rich-black-btn', appearanceList?.buttonColor?.secondary);
        document.documentElement.style.setProperty('--primary-black', appearanceList?.textColor?.primary);
        document.documentElement.style.setProperty('--secondary-black', appearanceList?.textColor?.secondary);
        document.documentElement.style.setProperty('--rich-black-btn-text', appearanceList?.buttonTextColor);
        // }
    }, [appearanceList])

    return loggedInUserLoading ?
        <Loader fullscreen />
        : (
            <div className={`${sideBarValue ? "overlay app_wrapper" : "app_wrapper"}`} >
                {
                    token ? (
                        <>
                            <SideBar />
                            <div className="dashboard-main">
                                <div><UserHeader /></div>
                                <div className="view-header">
                                    <h2>
                                        {
                                            (headerValue?.name === "userDetaile" || headerValue?.name === "CHW") && <span onClick={() => navigate("/app/users")}>{leftArrow}</span>
                                        }
                                        {headerValue?.heading}
                                    </h2>
                                </div>
                                <div className="dasboard-sec "><Outlet /></div>
                            </div>
                        </>
                    ) : (
                        <Navigate to={PATH_LIST.login} />
                    )
                }
            </div>
        );
};
export default Layout;