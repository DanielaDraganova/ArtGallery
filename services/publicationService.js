const Publication = require("../models/Publication");
const User = require("../models/User");

exports.getAll = () => Publication.find();
exports.getOneWithAuthor = (publicationId) =>
  Publication.findById(publicationId).populate("author");
exports.getOne = (publicationId) => Publication.findById(publicationId);
exports.update = (publicationId, publicationData) => {
  console.log(publicationData);
  console.log(publicationId);
  return Publication.updateOne(
    { _id: publicationId },
    { $set: publicationData },
    { runValidators: true }
  );
};

exports.deleteOne = (publicationId) =>
  Publication.deleteOne({ _id: publicationId });
exports.create = (publicationData) => Publication.create(publicationData);
