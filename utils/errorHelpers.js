const { auth } = require("../middlewares/authMiddleware");

exports.getErrorMessage = (err) => {
  let errorMessage = err.message;

  //Only mongoose error has errors object inside the error
  if (err.errors) {
    errorMessage = Object.values(err.errors)[0].message;
  }
  return errorMessage;
};
