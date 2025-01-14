const express = require("express");
const { ReviewController } = require("../controllers/Review.controller");
const router = express.Router();

router.post("/userReview", ReviewController.createNewUserReview);
router.get("/userReview", ReviewController.getAllUserReview);

module.exports.VisitorRouter = router;
