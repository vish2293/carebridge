
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setActiveHeader } from "../../redux/slices/headerSlice";

import { Tabs } from "antd";

import "./styles.scss";
import Profile from "../Profile";
import Reminder from "../Reminder";

const Settings = () => {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setActiveHeader({ name: "settings", heading: "Settings" }));
  }, []);

  const items = [
    {
      key: "1",
      label: "My Profile",
      children: <Profile />,
    },
    {
      key: "2",
      label: "Reminder Settings",
      children: <Reminder />,
    },

  ];
  return (

    <div className="setting-sec">
      <Reminder />
    </div>
  );
};

export default Settings;
