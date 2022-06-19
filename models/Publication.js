const mongoose = require("mongoose");

const publicationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: [6, "The Title should be a minimum of 6 characters long"],
  },
  paintingTechnique: {
    type: String,
    requred: true,
    maxlength: [
      15,
      "Painting technique should be a maximum of 15 characters long",
    ],
  },
  artPicture: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^https?/.test(v);
      },
      message: "The Art picture should start with http:// or https://",
    },
  },
  certificate: { type: String, enum: ["Yes", "No"], required: true },
  author: { type: mongoose.Types.ObjectId, ref: "User" },
  usersShared: [{ type: mongoose.Types.ObjectId, ref: "User" }],
});

module.exports = mongoose.model("Publication", publicationSchema);
