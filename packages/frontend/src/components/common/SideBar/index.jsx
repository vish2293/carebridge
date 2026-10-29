import { subMenus } from "../../../constant/subMenus";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { PATH_LIST } from "../../../constant/path-list";
import { Button, Menu, Tooltip } from "antd";
import { questionIcon } from "../../../assets/icons";
import { setActiveSidebar } from "../../../redux/slices/headerSlice";
import SideBarDrawer from "../SidebarDrawer";
import { useEffect, useState } from "react";

const SideBar = () => {
  const { loggedInUser } = useSelector((state) => state.user);
  const { sideBarValue, headerValue } = useSelector((state) => state.header);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openedKeys, setOpenedKeys] = useState([]);

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
    const openedKey = keyMappings[headerValue?.name] || headerValue?.name;
    if (openedKey) {
      setOpenedKeys([openedKey]);
    }
  }, [headerValue]);

  const handleSideBar = () => {
    dispatch(setActiveSidebar(false));
  };

  const openContactUs = () => {
    window.open(PATH_LIST.contactus);
  };

  const handleSubMenuChange = (keys) => {
    setOpenedKeys(keys);
  };

  const getSelectedKeys = (role, value) => {
    switch (role) {
      case "Program_Administrator":
        return value;
      case "CHW":
        if (value === "users") {
          return "client";
        }
        return value;
      default:
        return;
    }
  };

  const handleClick = (itemKey) => {
    const parentKey = keyMappings[itemKey];
    if (parentKey && !openedKeys.includes(parentKey)) {
      setOpenedKeys([...openedKeys, parentKey]);
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
            selectedKeys={getSelectedKeys(
              loggedInUser?.role,
              headerValue?.name
            )}
            onOpenChange={handleSubMenuChange}
          >
            {subMenus.map((menuItem) => {
              if (
                loggedInUser?.role === "Program_Administrator" &&
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
                          [
                            "clientReport",
                            "visitReport",
                            "objectiveReport",
                            "actionSteps",
                            "nextImportantDateReport",
                            "reminder",
                            "resourceGivenReport",
                            "demo_graphy",
                            "appearance",
                            "pathwayReport",
                          ].includes(childItem.key) && (
                            <Menu.Item
                              key={childItem.key}
                              onClick={() => handleClick(childItem.key)}
                            >
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
              } else if (
                loggedInUser?.role === "CHW" &&
                [
                  "dashboard",
                  "resource",
                  "visits",
                  "client",
                  "calendar",
                  "todo",
                  "reports",
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
                          [
                            "clientReport",
                            "visitReport",
                            "objectiveReport",
                            "actionSteps",
                            "nextImportantDateReport",
                            "resourceGivenReport",
                            "pathwayReport",
                          ].includes(childItem.key) && (
                            <Menu.Item
                              key={childItem.key}
                              onClick={() => handleClick(childItem.key)}
                            >
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
                    <NavLink to={menuItem.path}>{menuItem.name}</NavLink>
                  </Menu.Item>
                );
              } else if (
                loggedInUser?.role === "Client" &&
                ["dashboard", "visitReport", "request", "todo"].includes(
                  menuItem.id
                )
              ) {
                return (
                  <Menu.Item key={menuItem.id} icon={menuItem.icon}>
                    <NavLink to={menuItem.path}>{menuItem.name}</NavLink>
                  </Menu.Item>
                );
              }
            })}
          </Menu>

          <div className="help">
            <div className="question_icon">{questionIcon}</div>
            <h4 className="small-heading">Need Help?</h4>
            <p>Need help? Contact CareBridge support.</p>
            <Button
              className="yellow-btn"
              type="primary"
              onClick={openContactUs}
            >
              Contact Support
            </Button>
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
