import { Link } from 'react-router-dom'
import LogInHeader from '../../components/common/LogInHeader'
import LogInSignupLeft from '../../components/common/LogInSignupLeft'
import ContactForm from './ContactForm'
import { callIcon, contactLocationIcon, locationIcon, messageIcon, phoneIcon, quoteIcon } from '../../assets/icons'
import './style.scss'
import { Button, Form, message } from 'antd'
import { useDispatch } from 'react-redux'
import { sendContactUsEmail } from '../../redux/actions/user'

const Contact = () => {
  //For dispatch
  const dispatch = useDispatch()
  const [form] = Form.useForm()
  const formValues = Form.useWatch([], form);
  //For handle on finish
  const handleOnFinish = (values) => {
    dispatch(sendContactUsEmail({ payload: values })).then((res) => {
      if (res?.payload?.status === true) {
        message.success("Email sent!")
        form.resetFields()
      }
    })
  }

  //For handle finish failed
  const handleFinishFailed = () => {
    message.error("Something went wrong!")
  }

  const data = [
    { icon: callIcon, text: "+1 (344) 132-3434-34", tag: "tel" },
    { icon: messageIcon, text: "support@comunitycare.com", tag: "link" },
    { icon: contactLocationIcon, text: "4930 Alaska Hwy, Fort Nelson British Columbia, Voc ice" },
  ]

  return (
    <div className='main-sec '>
      <div className='main-sec-left'>
        <LogInSignupLeft
          icon={quoteIcon}
          title1={"Get in "}
          title2={"Touch"}
          description={"\"For he who has health has hope; and he who has hope, has everything.” Arthur Owen"}
          data={data}
        />
      </div>
      <div className='main-sec-right contact'>
        <LogInHeader />
        <div className='inner-right'>
          <div className='login-right'>
            <div className='login-right-top'>
              <h2 className='login-heading'>Contact Us</h2>
              <ContactForm form={form} formValues={formValues} handleOnFinish={handleOnFinish} handleFinishFailed={handleFinishFailed} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Contact
