import { subMenus } from "../../../constant/subMenus";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { PATH_LIST } from "../../../constant/path-list";
import { Menu, Tooltip } from "antd";
import { questionIcon } from "../../../assets/icons";
import { setActiveSidebar } from "../../../redux/slices/headerSlice";
import SideBarDrawer from "../SidebarDrawer";
import { useEffect, useState } from "react";

const SideBar = () => {
  const { loggedInUser } = useSelector((state) => state.user);
  const { sideBarValue, headerValue } = useSelector((state) => state.header);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [openedKeys, setOpenedKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);

  const keyMappings = {
    reportTask: "reports",
    nextImportantDateReport: "reports",
    actionSteps: "reports",
    visitReport: "reports",
    clientReport: "reports",
    reminder: "settings",
    demo_graphy: "settings",
    appearance: "settings",
    objectiveReport: "reports",
    resourceGivenReport: "reports",
    pathwayReport: "reports",
  };

  useEffect(() => {
    const currentPath = location.pathname;
    let selectedKey;

    subMenus.forEach((menu) => {
      if (menu.path && currentPath.includes(menu.path)) {
        selectedKey = menu.id;
      }
      if (menu.subItem) {
        menu.subItem.forEach((sub) => {
          if (currentPath.includes(sub.path)) {
            selectedKey = sub.key;
          }
        });
      }
    });

    setSelectedKeys([selectedKey]);
    const openedKey = keyMappings[headerValue?.name] || headerValue?.name;
    setOpenedKeys([openedKey]);
  }, [location, headerValue]);

  const handleSubMenuChange = (keys) => {
    setOpenedKeys(keys);
  };

  const handleSideBar = () => {
    dispatch(setActiveSidebar(false));
  };

  const getSelectedKeys = (role, value) => {
    switch (role) {
      case "Super_Admin":
        return value;
      default:
        return;
    }
  };

  return (
    <>
      <header className={"side-bar hide"}>
        <div className="sidebar_wrapper">
          <div
            className="logo"
            onClick={() => navigate(PATH_LIST.user.dashboard)}
            style={{ cursor: 'pointer', padding: '20px 15px' }}
          >
            <span style={{ 
              fontSize: '1.4rem', 
              fontWeight: '700', 
              color: '#0F766E',
              letterSpacing: '-0.5px'
            }}>
              care<span style={{ color: '#fff' }}>bridge</span>
            </span>
          </div>
          <Menu
            mode="inline"
            theme="dark"
            defaultSelectedKeys={["dashboard"]}
            openKeys={openedKeys}
            // selectedKeys={selectedKeys}
            selectedKeys={getSelectedKeys(
              loggedInUser?.role,
              headerValue?.name
            )}
            onOpenChange={handleSubMenuChange}
          >
            {subMenus.map((menuItem) => {
              if (
                loggedInUser?.role === "Super_Admin" &&
                [
                  "dashboard",
                  "users",
                  "resource",
                  "visits",
                  "reports",
                  "questionnaire",
                  "calendar",
                  "todo",
                  "settings",
                  "importClient",
                  "pathway",
                  "program_admin",
                  "chw",
                ].includes(menuItem.id)
              ) {
                if (menuItem.subItem) {
                  return (
                    <Menu.SubMenu
                      key={menuItem.id}
                      title={
                        <>
                          <span className="anticon anticon-mail ant-menu-item-icon">
                            {menuItem.icon}
                          </span>
                          <span className="ant-menu-title-content">
                            {menuItem.name}
                          </span>
                        </>
                      }
                    >
                      {menuItem.subItem.map(
                        (childItem) =>
                          (childItem.key === "clientReport" ||
                            childItem.key === "visitReport" ||
                            childItem.key === "objectiveReport" ||
                            childItem.key === "actionSteps" ||
                            childItem.key === "nextImportantDateReport" ||
                            // childItem.key === "reminder" ||
                            childItem.key === "resourceGivenReport" ||
                            childItem.key === "pathwayReport" ||
                            childItem.key === "demo_graphy" ||
                            childItem.key === "appearance") && (
                            <Menu.Item key={childItem.key}>
                              <Tooltip title={childItem.label}>
                                <NavLink to={childItem.path} end>
                                  {childItem.label}
                                </NavLink>
                              </Tooltip>
                            </Menu.Item>
                          )
                      )}
                    </Menu.SubMenu>
                  );
                }
                return (
                  <Menu.Item key={menuItem.id} icon={menuItem.icon}>
                    <NavLink to={menuItem.path} end>
                      {menuItem.name}
                    </NavLink>
                  </Menu.Item>
                );
              }
            })}
          </Menu>
          <div className="help">
            <div className="question_icon">{questionIcon}</div>
            <h4 className="small-heading">Need Help?</h4>
            <p>Need help? Contact CareBridge support.</p>
          </div>
        </div>
      </header>
      <SideBarDrawer
        sideBarValue={sideBarValue}
        headerValue={headerValue}
        handleSideBar={handleSideBar}
        subMenus={subMenus}
        getSelectedKeys={getSelectedKeys}
        handleSubMenuChange={handleSubMenuChange}
        openedKeys={openedKeys}
        loggedInUser={loggedInUser}
      />
    </>
  );
};

export default SideBar;
