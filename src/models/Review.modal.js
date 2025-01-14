const mongoose = require("mongoose");

const Schema = new mongoose.Schema(
  {
    profilePicture: {
      url: {
        type: String,
      },
      urlId: {
        type: String,
      },
    },
    username: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    userReview: {
      type: String,
    },
    userRating: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

exports.review = mongoose.model("Review", Schema);
