import ReactDOM from "react-dom/client";
import { ConfigProvider } from "antd";
import App from "./App.jsx";
import "./index.scss";
import "./theme.scss";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { store } from "./redux/index.js";

const theme = {
  token: {
    colorPrimary: "#0f766e",
    colorTextBase: "#12211f",
    colorBorder: "#d9e1de",
    borderRadius: 10,
    fontFamily: '"Figtree", sans-serif',
  },
  components: {
    Menu: { darkItemBg: "transparent", darkSubMenuItemBg: "transparent" },
  },
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <ConfigProvider theme={theme}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ConfigProvider>
  </Provider>
);
