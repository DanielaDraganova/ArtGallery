const { getErrorMessage } = require("../utils/errorHelpers");

exports.errorHandler = (err, req, res, next) => {
  console.log("INSIDE ERROR HANDLER");
  console.log(err);
  const status = err.status || 404;
  res.status(status).render("404", { error: getErrorMessage(err) });
};
