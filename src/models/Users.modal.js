const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Hasher = require("../helpers/Hasher.helper");

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
      unique: true,
    },
    email: {
      type: String,
      unique: true,
    },
    role: {
      type: String,
      enum: ["Admin", "Organizer", "Teacher", "Student"],
      default: "User",
    },
    class: {
      type: String,
      default: "Yet To Be Alloted",
    },
    phone: {
      type: Number,
    },
    password: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const virtual = Schema.virtual("id");
virtual.get(function () {
  return this._id;
});
Schema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

Schema.methods.comparePassword = function (candidatePassword) {
  return new Promise((resolve, reject) => {
    Hasher.compare(candidatePassword, this.password)
      .then((isMatch) => resolve(isMatch))
      .catch((err) => reject(err));
  });
};

Schema.methods.generateToken = (data) => {
  return jwt.sign(
    { ...data },
    process.env.JWT_SECRET
    // JWT_EXPIRY
  );
};
Schema.methods.generateRefreshToken = function (data) {
  return jwt.sign(
    { ...data },
    JWT_REFRESH_SECRET
    // JWT_REFRESH_EXPIRY
  );
};
Schema.methods.generateVerifyEmailToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      name: this.name,
    },
    JWT_EMAIL_VERIFY_SECRET || "abcd"
  );
};

exports.User = mongoose.model("User", Schema);
