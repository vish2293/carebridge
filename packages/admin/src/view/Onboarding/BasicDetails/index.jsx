import { DatePicker, Form, Input, } from "antd"
import { emailValidation, firstNameValidation, lastNameValidation, phoneValidation } from "../../../helpers/formValidation"
import { disabledBirthDate } from "../../../helpers"

const BasicDetails = ({ form, onFinish, handleBasicChange, }) => {
    return (
        <>
            <div className="onboard-head">Add Personal Information</div>
            <Form
                layout="vertical"
                form={form}
                onFinish={onFinish}
            >

                <div className="two-fill-row ">
                    <Form.Item label="First Name / Primer nombre" name={"firstName"} rules={[{ required: true, validator: firstNameValidation }]}>
                        <Input placeholder="Enter your first name" onChange={(e) => handleBasicChange("firstName", e?.target?.value)} />
                    </Form.Item>
                    <Form.Item label="Last Name / Apellido" name={"lastName"} rules={[{ required: true, validator: lastNameValidation }]}>
                        <Input placeholder="Enter your last name" onChange={(e) => handleBasicChange("lastName", e?.target?.value)} />
                    </Form.Item>
                </div>
                <div className="two-fill-row ">
                    <Form.Item label="Phone Number / Número de teléfono" name={"Phone"} rules={[{ required: true, validator: phoneValidation }]}>
                        <Input placeholder="Enter your phone number" onChange={(e) => handleBasicChange("Phone", e?.target?.value)} />
                    </Form.Item>
                    <Form.Item label="Email Address / dirección de correo electrónico" name={"email"} >
                        <Input placeholder="Enter your email" onChange={(e) => handleBasicChange("email", e?.target?.value)} />
                    </Form.Item>
                </div>
                <div className="two-fill-row ">
                    <Form.Item label="Date of Birth / Fecha de nacimiento" rules={[{ required: true, message: "Birth date is required" }]} name={'birthDate'}>
                        <DatePicker placeholder="Select your birth date" disabledDate={disabledBirthDate} onChange={(value) => handleBasicChange("birthDate", value)} format={"MM/DD/YYYY"}/>
                    </Form.Item>
                    <Form.Item label="Zip code / Código postal" name={"zipCode"} rules={[{ required: true, message: "Zip code is required" }]}>
                        <Input placeholder="Enter your zip code" onChange={(e) => handleBasicChange("zipCode", e?.target?.value)} />
                    </Form.Item>

                </div>

            </Form>
        </>
    )
}
export default BasicDetails
