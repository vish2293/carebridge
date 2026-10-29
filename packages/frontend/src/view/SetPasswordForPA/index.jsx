import { Button, Form, Input, message } from "antd";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { leftArrow, lockIcon, quoteIcon } from "../../assets/icons";
import LogInHeader from "../../components/common/LogInHeader";
import LogInSignupLeft from "../../components/common/LogInSignupLeft";
import { PATH_LIST } from "../../constant/path-list";
import { passowrdValidation } from "../../helpers/formValidation";
import { setPasswordForPA, verifyPAPasswordLink } from "../../redux/actions/user";

export const SetPasswordForPA = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get("token")

    const handleSetPassword = (values) => {
        const payload = {
            password: values.password,
            token
        };
        dispatch(setPasswordForPA({ payload })).then((res) => {
            if (res?.payload?.status === true) {
                message.success("Password set successfully! You're all set to go.");
                navigate(PATH_LIST.login)
            }
        });
    };

    useEffect(() => {
        dispatch(verifyPAPasswordLink({ token })).then((res) => {
            if (res?.payload?.status === false) {
                message.error(res?.payload?.message)
                navigate(PATH_LIST.login)
            } else if (res?.payload?.data?.status === false) {
                message.error(res?.payload?.data?.message)
                navigate(PATH_LIST.login)
            }
        })
    }, [token])

    return (
        <div className='main-sec'>
            <div className='main-sec-left'>
                <LogInSignupLeft
                    title1={"Empowering Lives, "}
                    title2={"Making a Difference"}
                    description={"For he who has health has hope; and he who has hope, has everything.” Arthur Owen"}
                    icon={quoteIcon} />
            </div>
            <div className='main-sec-right'>
                <LogInHeader />
                <div className='inner-right'>
                    <div className='login-right'>
                        <div className='login-right-top'>
                            <h2 className='login-heading'>Set new password</h2>
                            <p>Create your new strong password. You can then log in using it.</p>

                            <Form onFinish={handleSetPassword} layout='vertical' style={{ minWidth: 400 }}>
                                <Form.Item name='password' label="Password" rules={[{ required: true, validator: passowrdValidation }]}>
                                    <Input.Password prefix={lockIcon} placeholder='Enter Unique password' />
                                </Form.Item>

                                <Form.Item name='confirmPassword' label="Confirm Password" rules={[{ required: true }, ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        ``;
                                        if (!value || getFieldValue("password") === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error("Password does not match!"));
                                    },
                                }),]}>
                                    <Input.Password prefix={lockIcon} placeholder='Enter confirm password' />
                                </Form.Item>
                                <div className='full-width-btn'>
                                    <Button type="primary" htmlType="submit" className="login-form-button" >
                                        Set password
                                    </Button>
                                </div>
                            </Form>

                        </div>
                        <div className='login-roght-bottom'>
                            <Link to={PATH_LIST.login} className='back-link'>
                                <span className='left-arrow'>{leftArrow}</span>
                                <span>
                                    Back to login
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    );
};