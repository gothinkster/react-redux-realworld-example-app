const patterns = {
  firstNamePattern: /^\D+$/,
  lastNamePattern: /^\D+$/,
  fullNamePattern: /^\D+\s\D+$/,
  usernamePattern: /^\w{5,}$/,
  passwordPattern: /^.{8,}$/,
  emailPattern: /^[\w.]+@\w+.\w+$/
};

export default patterns;
