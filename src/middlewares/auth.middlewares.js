const jwt = require("jsonwebtoken");

module.exports.Auth = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).send({
        error: true,
        result: null,
        message: "Authorization header is missing",
      });
    }

    const token = authHeader.split(" ")[1];
    if (!token || token === "null") {
      return res.status(401).send({
        error: true,
        result: null,
        message: "UnAuthorized",
      });
    }
    console.log(token);

    // Assuming JWT_SECRET is loaded correctly from .env
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedData;

    console.info("<------------Authenticating--------->");
    console.info({ token, decodedData });
    console.info("<----------------End---------------->");

    next();
  } catch (error) {
    console.error("Error in Auth middleware:", error);
    res.status(401).send({
      error: true,
      result: null,
      message: "Invalid or expired token",
    });
  }
};

module.exports.Role = async (role) => {
  return (req, res, next) => {
    const userRole = req.user.role; // Assuming `req.user` contains the authenticated user's data

    if (userRole !== role) {
      return res.status(403).send("Forbidden");
    }

    next(); // User has the correct role, so proceed to the next middleware or route handler
  };
};
