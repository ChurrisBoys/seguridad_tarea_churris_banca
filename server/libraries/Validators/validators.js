// validators.js

const validateUsername = (username) => {
  // Username should consist of only letters and one period in the middle
  const usernameRegex = /^[a-zA-Z]{1,80}(\.[a-zA-Z]{1,80})?$/;
  return usernameRegex.test(username);
};

const validatePassword = (password) => {
  // Password should consist of only letters and numbers
  const passwordRegex = /^[[a-zA-Z0-9]]{1,80}$/;
  return passwordRegex.test(password);
};

const validateNormalText = (text) => {
  // Normal text can contain letters, numbers, spaces, commas, periods, exclamation points, and question marks
  const normalTextRegex = /^[a-zA-Z0-9,.?! ]{1,200}$/;
  return normalTextRegex.test(text);
};

const validateAmount = (amount) => {
  // Amount can be a number with or without a decimal part
  const amountRegex = /^\d+(\.\d+)?$/;
  return amountRegex.test(amount);
};

const validatePhoneNumber = (phoneNumber) => {
  // Phone number should be exactly 8 digits
  const phoneRegex = /^\d{8}$/;
  return phoneRegex.test(phoneNumber);
};

const validateEmail = (email) => {
  // Email should consist of letters, periods (letters@letters.letters)
  const emailRegex = /^[a-zA-Z]{1,80}(\.[a-zA-Z]{1,80})*@[a-zA-Z]{1,30}(\.[a-zA-Z]{1,30}){1,80}$/;
  return emailRegex.test(email);
};


module.exports = {
  validateUsername,
  validatePassword,
  validateNormalText,
  validateAmount,
  validatePhoneNumber,
  validateEmail,
};
