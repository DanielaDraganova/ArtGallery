const authService = require("../services/authService");

const router = require("express").Router();
const { COOKIE_SESSION_NAME } = require("../constants");
const { isAuth, isGuest } = require("../middlewares/authMiddleware");
const { getErrorMessage } = require("../utils/errorHelpers");

router.get("/register", isGuest, (req, res) => {
  res.render("auth/register");
});

router.post("/register", isGuest, async (req, res) => {
  const { username, password, repass, address } = req.body;
  console.log(req.body);
  if (password !== repass) {
    return res.render("auth/register", { error: "Passwords don't match!" });
  }

  try {
    //Create user
    const createdUser = await authService.create({
      username,
      password,
      address,
    });
    const token = await authService.createToken(createdUser);
    res.cookie(COOKIE_SESSION_NAME, token, { httpOnly: true });

    // !!! in case the user needs to log in after registration
    res.redirect("/");
  } catch (err) {
    // add mongoose error mapper
    return res.render("auth/register", { error: getErrorMessage(err) });
  }
});

router.get("/login", isGuest, (req, res) => {
  res.render("auth/login");
});

router.post("/login", isGuest, async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await authService.login(username, password);
    const token = await authService.createToken(user);

    res.cookie(COOKIE_SESSION_NAME, token, { httpOnly: true });

    res.redirect("/");
  } catch (err) {
    next(err);
  }
});

router.get("/logout", isAuth, (req, res) => {
  res.clearCookie(COOKIE_SESSION_NAME);
  res.redirect("/");
});

module.exports = router;
