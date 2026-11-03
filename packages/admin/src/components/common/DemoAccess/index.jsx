import React, { useState } from "react";
import { Button, message } from "antd";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { demoLogin } from "../../../redux/actions/user";
import { PATH_LIST } from "../../../constant/path-list";

// Shown only when VITE_APP_DEMO=true. One click signs in to a sample account (no OTP) for client demos.
const roles = [{ role: 'Super_Admin', label: 'Super Admin' }]

const DemoAccess = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [busy, setBusy] = useState("");

  if (import.meta.env.VITE_APP_DEMO !== "true") return null;

  const start = (role) => {
    setBusy(role);
    dispatch(demoLogin({ role })).then((res) => {
      if (res.payload?.status === true) {
        localStorage.setItem("token", res.payload.token);
        navigate(PATH_LIST.user.dashboard);
      } else {
        message.error(res.payload?.message || "Demo is not available right now.");
        setBusy("");
      }
    });
  };

  return (
    <div className="demo-access">
      <div className="demo-access-label"><span>or explore with sample data</span></div>
      <div className="demo-access-buttons">
        {roles.map((r) => (
          <Button key={r.role} block loading={busy === r.role} disabled={!!busy} onClick={() => start(r.role)}>
            Try demo as {r.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default DemoAccess;
