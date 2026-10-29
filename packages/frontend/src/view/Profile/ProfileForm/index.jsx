/* eslint-disable react/prop-types */
import { Button, Form, Input } from "antd";
import { emailValidation, firstNameValidation, lastNameValidation, phoneValidation } from "../../../helpers/formValidation";

const ProfileForm = ({ loggedInUser, form, editMoad, handleCancelEdit, handleSaveChanges }) => {

  return (
    <Form
      layout='vertical'
      defaultValue={true}
      form={form}
      initialValues={loggedInUser}
    >
      <div className='two-fill-row'>
        <Form.Item label="First Name" name={"firstName"} rules={[{ required: true, validator: firstNameValidation }]}>
          <Input placeholder='Enter first name' />
        </Form.Item>
        <Form.Item label="Last Name" name={"lastName"} rules={[{ required: true, validator: lastNameValidation }]}>
          <Input placeholder='Enter last name' />
        </Form.Item>
      </div>
      <div className='two-fill-row'>
        <Form.Item label="Phone Number" name={"Phone"} rules={[{ required: true, validator: phoneValidation }]}>
          <Input placeholder='Enter phone number' />
        </Form.Item>
        <Form.Item label="Email" name={"email"} rules={[{ required: false, }]}  >
          <Input placeholder='Enter email' disabled />
        </Form.Item>
      </div>
      <div className='two-fill-row'>
        <Form.Item label="Address" name={"address"} rules={[{ required: true, message: "Address is required" }]}>
          <Input.TextArea placeholder='Enter address' />
        </Form.Item>

        <Form.Item label="Zipcode" name={"zipCode"} rules={[{ required: true, message: "Zip code is required" }]}>
          <Input placeholder='Enter zip code' />
        </Form.Item>
      </div>
      {/* {
          editMoad &&
            <div className='cancel-save'>
              <Button onClick={handleCancelEdit} >Cancel</Button>
              <Button className='btn save-btn' onClick={() => handleSaveChanges()}>Save Changes</Button>
            </div> 
        } */}
    </Form>
  );
};

export default ProfileForm;
