export const emailValidation = async (rule, value) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!value) {
    return Promise.reject('Email is required');
  }

  if (!emailRegex.test(value)) {
    return Promise.reject('Please enter a valid email address');
  }

  return Promise.resolve();
};

export const firstNameValidation = async (rule, value) => {

  const nameRegex = /^[a-zA-Z ]+$/;
  if (!value) {
    return Promise.reject(`First name is required`);
  }
  if (!nameRegex.test(value)) {
    return Promise.reject(`Please enter valid first name`)
  }
  return Promise.resolve();
}

export const lastNameValidation = async (rule, value) => {
  const nameRegex = /^[a-zA-Z ]+$/
  if (!value) {
    return Promise.reject(`Last name is required`);
  }
  if (!nameRegex.test(value)) {
    return Promise.reject(`Please enter valid last name`)
  }
  return Promise.resolve();
}

export const userNameValidation = async (rule, value) => {
  const userNameRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+]).{8,}$/;
  if (!value) {
    return Promise.reject(`User Name is required`);
  }
  // if (!userNameRegex.test(value)) {
  //   return Promise.reject(`User name must have at least 8 characters, including 1 uppercase letter, 1 lowercase letter, 1 number, and 1 symbol.`);
  // }
  return Promise.resolve();
}

export const passowrdValidation = async (rule, value) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/;
  if (!value) {
    return Promise.reject('password is required');
  }
  if (!passwordRegex.test(value)) {
    return Promise.reject(`Password must have at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character`);
  }
  return Promise.resolve();
}

export const newPassowrdValidation = async (rule, value) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/;
  if (!value) {
    return Promise.reject('New password is required');
  }
  if (!passwordRegex.test(value)) {
    return Promise.reject(`Password must have at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character`);
  }
  return Promise.resolve();
}

export const phoneValidation = async (_, value) => {
  const phoneNumberRegex = /^[0-9]+$/;
  if (!value) {
    return Promise.reject('Phone No. is required');
  }
  if (!phoneNumberRegex.test(value)) {
    return Promise.reject("Please enter a valid phone number");
  }
  if (value.length < 7 || value.length > 15) {
    return Promise.reject("Phone number must be between 7 and 15 digits");
  }

  return Promise.resolve();
};

export const lengthOfVisitValidation = async (_, value) => {
  if (!value) {
    return Promise.reject('Length of visit is required');
  }
  if (value < 0) {
    return Promise.reject("Length of visit can't be less than zero")
  }
  if (value == 0) {
    return Promise.reject("Length of visit can't be zero")
  }
  return Promise.resolve()
}

export const timeValidation = (_, value) => {
  const date = new Date(value);
  const currentDate = new Date();

  if (date.getDate() === currentDate.getDate()) {
    if (currentDate.getHours() > date.getHours() || (currentDate.getHours() === date.getHours() && currentDate.getMinutes() >= date.getMinutes())) {
      return Promise.reject("You can't select past hours");
    }
  } else if (date > currentDate) {
    return Promise.resolve();
  }

  return Promise.resolve();
}


export const futureTimeValidation = (_, value) => {
  const date = new Date(value);
  const currentDate = new Date();
  if (!value) {
    return Promise.reject("Attempt date is required");
  }
  if (date.getDate() === currentDate.getDate()) {
    if (currentDate.getHours() < date.getHours() || (currentDate.getHours() === date.getHours() && currentDate.getMinutes() <= date.getMinutes())) {
      return Promise.reject("You can't select future hours");
    }
  } else if (date < currentDate) {
    return Promise.resolve();
  }

  return Promise.resolve();
}


export const futureVisitTimeValidation = (_, value) => {
  const date = new Date(value);
  const currentDate = new Date();
  if (!value) {
    return Promise.reject("Visit date is required");
  }
  if (date.getDate() === currentDate.getDate()) {
    if (currentDate.getHours() < date.getHours() || (currentDate.getHours() === date.getHours() && currentDate.getMinutes() <= date.getMinutes())) {
      return Promise.reject("You can't select future hours");
    }
  } else if (date < currentDate) {
    return Promise.resolve();
  }

  return Promise.resolve();
}

export const webSiteUrlValidation = (_, value) => {
  if (!value) {
    return Promise.resolve(); 
  }

  const urlRegex = /^(https?:\/\/)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/;

  try {
    new URL(value); 
    if (!urlRegex.test(value)) {
      return Promise.reject("Please input a valid URL starting with http or https.");
    }
    return Promise.resolve(); 
  } catch (e) {
    return Promise.reject("Please input a valid URL starting with http or https.");
  }
};


export const resourceEmailValidation = async (rule, value) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!value) {
    return Promise.resolve();
  }

  if (!emailRegex.test(value)) {
    return Promise.reject('Please enter a valid email address');
  }

  return Promise.resolve();
};

