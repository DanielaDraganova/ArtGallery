const router = require("express").Router();
const userService = require("../services/userService");
const publicationService = require("../services/publicationService");
const Publication = require("../models/Publication");

router.get("/", async (req, res) => {
  const publications = await publicationService.getAll().lean();
  const publicationShares = publications.map((p) => ({
    ...p,
    shareCount: p.usersShared.length,
  }));

  res.render("home", { publicationShares });
});

router.get("/profile", async (req, res) => {
  const user = await userService.getOne(req.user._id).lean();

  res.render("profile", { ...user });
});

module.exports = router;
