/* eslint-disable react/prop-types */

const ProfileDetaile = ({ loggedInUser }) => {

  return (
    <div>
      <div className='user_contact_info'>
        <div className='contact-info w-50'>
          <div className='heading black f-14 bold600'>First name </div>
          <div className='heading secondary60 f-14 bold400'>{loggedInUser?.firstName}</div>
        </div>
        <div className='contact-info w-50'>
          <div className='heading black f-14 bold600'>Last Name</div>
          <div className='heading secondary60 f-14 bold400'>{loggedInUser?.lastName}</div>
        </div>
      </div>
      <div className='user_contact_info'>
        <div className='contact-info w-50'>
          <div className='heading black f-14 bold600'>Phone number</div>
          <div className='heading secondary60 f-14 bold400'>{loggedInUser?.Phone}</div>
        </div>
        <div className='contact-info w-50'>
          <div className='heading black f-14 bold600'>Email</div>
          <div className='heading secondary60 f-14 bold400'>{loggedInUser?.email}</div>
        </div>
      </div>
      <div className='user_contact_info'>
        <div className='contact-info  w-50'>
          <div className='heading black f-14 bold600'>Address</div>
          <div className='heading secondary60 f-14 bold400'>{loggedInUser?.address}</div>
        </div>
        <div className='contact-info  w-50'>
          <div className='heading black f-14 bold600'>ZipCode</div>
          <div className='heading secondary60 f-14 bold400'>{loggedInUser?.zipCode}</div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetaile;
