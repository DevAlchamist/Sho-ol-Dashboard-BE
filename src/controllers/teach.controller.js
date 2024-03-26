const jwt = require("jsonwebtoken");
const HasherHelper = require("../helpers/Hasher.helper");
const HttpError = require("../helpers/HttpError.helpers");
const Response = require("../helpers/Response.helpers");
const { TeachService } = require("../services/teach.service");

class TeachController {
  createNewTeach = async (req, res) => {
    const user = await TeachService.findOne({ email: req.body.email });
    console.log({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });

    if (user) {
      throw new HttpError(401, "User Already Exists");
    }

    const salt = await HasherHelper.getSalt(10);

    const hash = await HasherHelper.hash(req.body.password, salt);

    req.body.password = hash;

    const newUser = await TeachService.create({ ...req.body });
    // Generate access and refresh tokens for the new user
    const accessToken = jwt.sign(
      { _id: newUser._id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    const refreshToken = jwt.sign(
      { _id: newUser._id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    console.log({ accessToken: accessToken, refreshToken: refreshToken });
    Response(res)
      .status(201)
      .message("New user created")
      .body({ accessToken, refreshToken })
      .send();
  };
  loginViaPassword = async (req, res, next) => {
    console.log(process.env);
    const { email, password } = req.body;
    console.log({ email, password });

    let user = await TeachService.findOne({ email });
    console.log(user);

    if (!user) {
      throw new HttpError(404, "User Not Found");
    }

    console.log("JWT_SECRET", process.env.JWT_SECRET);
    // Verify the password
    const isVerify = await HasherHelper.compare(password, user.password);
    if (!isVerify) throw new HttpError(401, "Invalid Credentials");
    // Generate access and refresh tokens for the user
    const accessToken = jwt.sign(
      { _id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log({
      email: user.email,
      username: user.username,
      accessToken,
      role: user.role,
    });
    Response(res)
      .status(201)
      .body({
        accessToken,
        role: user.role,
      })
      .send();
  };

  editCurrentUser = async (req, res) => {
    if (req.body.password) {
      const salt = await HasherHelper.getSalt(10);

      const hash = await HasherHelper.hash(req.body.password, salt);

      req.body.password = hash;
    }

    const user = await TeachService.findByIdAndUpdate(req.user._id, {
      ...req.body,
    });

    if (!user) throw new HttpError(409, "User doesn't Exists!");

    Response(res).status(201).message("Successfully Updated!").send();
  };
  createAdminUser = async (req, res) => {
    await TeachService.create({ ...req.body, role: "Admin" });
    Response(res).status(201).message("Successfully Created").send();
  };
  getCurrentUser = async (req, res) => {
    const user = await TeachService.findById(req.user._id);
    Response(res).body(user).send();
  };
  getAllUsers = async (req, res) => {
    const user = await TeachService.find({
      _id: { $nin: [req.user._id] },
    }).sort({ createdAt: -1 });
    Response(res).body(user).send();
  };
  getUserDetails = async (req, res) => {
    const { userId } = req.params;
    const user = await TeachService.findById(userId);
    if (!user) throw new HttpError(400, "No User Exists!");

    Response(res).body(user).send();
  };
}

module.exports.TeachController = new TeachController();
