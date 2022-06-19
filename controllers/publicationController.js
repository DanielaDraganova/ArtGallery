const router = require("express").Router();

const { isAuth } = require("../middlewares/authMiddleware");
const publicationService = require("../services/publicationService");
const userService = require("../services/userService");

const { getErrorMessage } = require("../utils/errorHelpers");

//router.use(isAuth);

router.get("/", async (req, res) => {
  const publications = await publicationService.getAll().lean();
  res.render("publication", { publications });
});

router.get("/create", isAuth, (req, res) => {
  res.render("publication/create");
});

router.post("/create", isAuth, async (req, res) => {
  const publicationData = { ...req.body, author: req.user._id };

  try {
    const publication = await publicationService.create(publicationData);
    await userService.addPublication(req.user._id, publication._id);

    res.redirect("/publications");
  } catch (err) {
    res.render("publication/create", {
      ...req.body,
      error: getErrorMessage(err),
    });
  }
});

router.get("/:publicationId/details", async (req, res) => {
  const publication = await publicationService
    .getOneWithAuthor(req.params.publicationId)
    .lean();

  const isAuthor = publication.author._id == req.user?._id;
  let isShared = false;
  if (req.user) {
    isShared = publication.usersShared
      .map((x) => x.toString())
      .includes(req.user._id);
  }

  res.render("publication/details", { ...publication, isAuthor, isShared });
});

const isPublicationOwner = async (req, res, next) => {
  const publication = await publicationService
    .getOne(req.params.publicationId)
    .lean();
  const isAuthor = publication.author == req.user?._id;
  if (!isAuthor) {
    return next({ message: "You are not authorized!", status: 401 });
  }
  res.publication = publication;
  next();
};

router.get("/:publicationId/edit", isAuth, async (req, res, next) => {
  const publication = await publicationService
    .getOne(req.params.publicationId)
    .lean();
  const isAuthor = publication.author == req.user?._id;
  if (!isAuthor) {
    return res.redirect("/");
  }
  res.render("publication/edit", { ...publication });
});

router.post("/:publicationId/edit", isAuth, async (req, res) => {
  const publication = await publicationService
    .getOne(req.params.publicationId)
    .lean();
  const isAuthor = publication.author == req.user?._id;
  if (!isAuthor) {
    return next({ message: "You are not authorized!", status: 401 });
  }
  try {
    await publicationService.update(req.params.publicationId, req.body);
    res.redirect(`/publications/${req.params.publicationId}/details`);
  } catch (err) {
    res.render("publication/edit", {
      ...req.body,
      error: getErrorMessage(err),
    });
  }
});

router.get(
  "/:publicationId/delete",
  isAuth,
  isPublicationOwner,
  async (req, res) => {
    await publicationService.deleteOne(req.params.publicationId);
    res.redirect("/publications");
  }
);

router.get("/:publicationId/share", isAuth, async (req, res) => {
  const publication = await publicationService.getOne(req.params.publicationId);

  publication.usersShared.push(req.user._id);
  await publication.save();
  res.redirect("/");
});
module.exports = router;
