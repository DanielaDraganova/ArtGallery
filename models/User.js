const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    minlength: [4, "The username should be at least 4 characters long"],
  },
  password: {
    type: String,
    required: [true, " Password is required"],
    minlength: [3, "The password should be at least 3 characters long"],
  },
  address: {
    type: String,
    required: true,
    maxlength: [20, "The address should be a maximum of 20 characters long"],
  },
  publications: [{ type: mongoose.Schema.Types.ObjectId, ref: "Publication" }],
});

userSchema.pre("save", function (next) {
  bcrypt.hash(this.password, 10).then((hashedPassword) => {
    this.password = hashedPassword;

    next();
  });
});

const User = mongoose.model("User", userSchema);
module.exports = User;
