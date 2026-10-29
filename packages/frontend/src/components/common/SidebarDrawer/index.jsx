import { Button, Drawer, Menu, Tooltip } from "antd";
import React from "react";
import { PATH_LIST } from "../../../constant/path-list";
import { NavLink, useNavigate } from "react-router-dom";
import { questionIcon, reportIcon } from "../../../assets/icons";
import "./style.scss";

const SideBarDrawer = ({
  sideBarValue,
  headerValue,
  getSelectedKeys,
  handleSideBar,
  openedKeys,
  handleSubMenuChange,
  subMenus,
  loggedInUser,
}) => {
  const navigate = useNavigate();

  //For report sub menu
  let items = [
    {
      label: "Report",
      key: "report",
      reportIcon,
      subItem: [
        loggedInUser.role === "Program_Administrator" && {
          label: "Client",
          key: "client",
          path: PATH_LIST.user.reports,
        },
        loggedInUser.role === "CHW" && {
          label: "Assigned Clients",
          key: "assignedClients",
          path: PATH_LIST.user.reports,
        },
        loggedInUser.role === "CHW" && {
          label: "Next Steps",
          key: "nextSteps",
          path: PATH_LIST.user.nextsteps,
        },
      ],
    },
  ];

  // Remove false values from the subItem array
  items = items.map((item) => {
    if (item.subItem && Array.isArray(item.subItem)) {
      item.subItem = item.subItem.filter(Boolean);
    }
    return item;
  });

  return (
    <Drawer
      open={sideBarValue}
      onClose={handleSideBar}
      width={200}
      className="side-bar sidebardrawer"
      placement="left"
    >
      {" "}
      <header className={`side-bar hide`}>
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
          <ul className="nav_item">
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
                  (menuItem.id === "dashboard" ||
                    menuItem.id === "users" ||
                    menuItem.id === "request" ||
                    menuItem.id === "reports" ||
                    menuItem.id === "resource" ||
                    menuItem.id === "questionnaire" ||
                    menuItem.id === "calendar" ||
                    menuItem.id === "todo" ||
                    menuItem.id === "settings" ||
                    menuItem.id === "pathway" ||
                    menuItem.id === "importClient")
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
                        {menuItem.subItem.map((childItem) => {
                          return (
                            (childItem.key === "clientReport" ||
                              childItem.key === "visitReport" ||
                              childItem.key === "objectiveReport" ||
                              childItem.key === "resourceGivenReport" ||
                              childItem.key === "pathwayReport" ||
                              childItem.key === "actionSteps" ||
                              childItem.key === "nextImportantDateReport" ||
                              childItem.key === "reminder" ||
                              childItem.key === "demo_graphy" ||
                              childItem.key === "appearance") && (
                              <Menu.Item
                                key={childItem.key}
                                onClick={handleSideBar}
                              >
                                <Tooltip title={childItem.label}>
                                  <NavLink to={childItem.path} end>
                                    {childItem.label}
                                  </NavLink>
                                </Tooltip>
                              </Menu.Item>
                            )
                          );
                        })}
                      </Menu.SubMenu>
                    );
                  }
                  return (
                    <Menu.Item key={menuItem.id} icon={menuItem.icon}>
                      <NavLink to={menuItem.path} end onClick={handleSideBar}>
                        {menuItem.name}
                      </NavLink>
                    </Menu.Item>
                  );
                } else if (
                  loggedInUser?.role === "CHW" &&
                  (menuItem.id === "dashboard" ||
                    menuItem.id === "request" ||
                    menuItem.id === "client" ||
                    menuItem.id === "resource" ||
                    menuItem.id === "calendar" ||
                    menuItem.id === "todo" ||
                    menuItem.id === "reports")
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
                              childItem.key === "resoruceGivenReport" ||
                              childItem.key === "pathwayReport" ||
                              childItem.key === "objectiveReport" ||
                              childItem.key === "actionSteps" ||
                              childItem.key === "nextImportantDateReport") && (
                              <Menu.Item key={childItem.key}>
                                <Tooltip title={childItem.label}>
                                  {" "}
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
                      <NavLink to={menuItem.path} onClick={handleSideBar} end>
                        {menuItem.name}
                      </NavLink>
                    </Menu.Item>
                  );
                } else if (
                  loggedInUser?.role === "Client" &&
                  (menuItem.id === "dashboard" ||
                    menuItem.id === "request" ||
                    menuItem.id === "todo")
                ) {
                  return (
                    <Menu.Item key={menuItem.id} icon={menuItem.icon}>
                      <NavLink to={menuItem.path} end onClick={handleSideBar}>
                        {menuItem.name}
                      </NavLink>
                    </Menu.Item>
                  );
                }
              })}
            </Menu>
          </ul>
          <div className="help">
            <div className="question_icon">{questionIcon}</div>
            <h4 className="small-heading">Need Help?</h4>
            <p>Need help? Contact CareBridge support.</p>
            <Button className="btn" type="primary">
              Contact Support
            </Button>
          </div>
        </div>
      </header>
    </Drawer>
  );
};

export default SideBarDrawer;
