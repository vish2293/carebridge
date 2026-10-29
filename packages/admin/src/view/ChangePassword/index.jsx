import { Button, Form, Input, message } from "antd";
import { PATH_LIST } from "../../constant/path-list";
import { leftArrow, lockIcon, quoteIcon } from "../../assets/icons";
import LogInHeader from "../../components/common/LogInHeader";
import LogInSignupLeft from "../../components/common/LogInSignupLeft";
import { passowrdValidation } from "../../helpers/formValidation";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { updatePassword, verifyResetPasswordLink } from "../../redux/actions/user";
import { useDispatch } from "react-redux";
import { useEffect } from "react";

const ChangePassword = () => {
    const { id } = useParams()
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get("token")
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleSetPassword = (values) => {
        const payload = {
            password: values.password,
            userId: id,
            token
        };
        dispatch(updatePassword({ payload })).then((res) => {
            if (res?.payload?.status === true) {
                message.success(res?.payload?.message);
                navigate(PATH_LIST.login)
            } else if (res?.payload?.status === false) {
                message.error(res?.payload?.message)
            }
        });
    };

    useEffect(() => {
        dispatch(verifyResetPasswordLink({ token })).then((res) => {
            if (res?.payload?.data?.status === false) {
                message.error(res?.payload?.data?.message)
                return navigate(PATH_LIST.login)
            }
        })
    }, [])


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
                            <h2 className='login-heading'>Reset Password</h2>
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
                                        Reset Password
                                    </Button>
                                </div>
                            </Form>
                        </div>
                    </div>
                </div>

            </div>

        </div>

    )
}
export default ChangePassword
