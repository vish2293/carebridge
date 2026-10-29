import { message, } from "antd";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createUser } from "../../redux/actions/user";
import "./style.scss";
import SignupForm from "./SignupForm";
import { PATH_LIST } from "../../constant/path-list";
import LogInHeader from "../../components/common/LogInHeader";
import LogInSignupLeft from "../../components/common/LogInSignupLeft";
const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  if (token) {
    return <Navigate to={PATH_LIST.user.dashboard} />;
  }

  //For user register
  const handleSubmit = (form) => {
    form.validateFields().then((values) => {
      values.visit_type = "Online";
      values.role = "Client";
      values.is_Verified = true;
      values.objective = [
        { label: "housingSecurity", value: "N/A" },
        { label: "foodSecurity", value: "N/A" },
        { label: "economicSecurity", value: "N/A" },
        { label: "transportationSecurity", value: "N/A" },
        { label: "childcareSecurity", value: "N/A" },
        { label: "employmentSecurity", value: "N/A" },
        { label: "educationSecurity", value: "N/A" },
        { label: "healthcareSecurity", value: "N/A" }
      ]
      dispatch(createUser(values)).then((res) => {
        if (res.payload.status === true) {
          message.success("Thank you for sign up!");
          form.resetFields();
          navigate(PATH_LIST.login);
        } else {
          message.error(res?.payload?.message);
        }
      });

    });


  };

  //handle submit failed
  const handleSubmitFailed = () => {
    message.error('Please fill in all required fields  check your form.');

  }
  return (
    <div className='main-sec'>
      <div className='main-sec-left'>
        <LogInSignupLeft
          title1={"Care that reaches "}
          title2={"every community."}
          description={"Create an account to request support, see who is helping you and get reminders before every visit."}
        />
      </div>
      <div className='main-sec-right'>
        <LogInHeader isContact={true} />
        <div className='inner-right signup'>
          <div className='login-right'>
            <div className='login-right-top'>
              <h2 className='login-heading'>Create your account</h2>
              <p>Request support and track every visit in one place.</p>
              <SignupForm
                handleSubmit={handleSubmit}
                handleSubmitFailed={handleSubmitFailed}
              />
            </div>
            <div className='login-roght-bottom'>
              <span> Already have an account?<Link to={PATH_LIST.login}> Log In </Link></span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SignUp;
