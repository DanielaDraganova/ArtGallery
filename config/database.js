const mongoose = require("mongoose");

// exports.dbInit = () => {
//   mongoose.connection.on("open", () => console.log("DB connected!"));

//   return mongoose.connect("mongodb://localhost:27017/artGallery", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   });
// };

// exports.connected = () =>
//   mongoose
//     .connect("mongodb://localhost:27017/artGallery", {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     })
//     .then(() => {
//       console.log("DB connected");
//     })
//     .catch((err) => {
//       console.log("DB error", err);
//     });

exports.connect = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/artGallery");
    console.log("Connected to mongoDB");
  } catch (err) {
    console.log("DB error", err);
  }
};
