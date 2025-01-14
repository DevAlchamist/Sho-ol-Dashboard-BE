const HttpError = require("../helpers/HttpError.helpers");
const Response = require("../helpers/Response.helpers");
const { review } = require("../models/Review.modal");

class ReviewController {
  createNewUserReview = async (req, res, next) => {
    try {
      const { username, email, userReview, userRating, profilePicture } =
        req.body;
      //   const existingUser = await review.findOne({ email });
      //   if (!existingUser) {
      //     throw new HttpError(401, "This person is not a User.");
      //   }
      const newReview = await review.create({
        username,
        email,
        userReview,
        userRating,
        profilePicture,
      });

      if (!newReview) {
        throw new HttpError(500, "Failed to create a new user review.");
      }

      // Send success response
      Response(res).status(201).message("New user review created").send();
    } catch (error) {
      next(error); // Pass errors to the global error handler
    }
  };

  getAllUserReview = async (req, res, next) => {
    try {
      // Retrieve and sort reviews
      const userReviews = await review.find();
      // Send success response
      Response(res).status(200).body(userReviews).send();
    } catch (error) {
      next(error); // Pass errors to the global error handler
    }
  };
}

module.exports.ReviewController = new ReviewController();
