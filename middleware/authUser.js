import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  try {
    const { token } = req.headers; 
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized. Please login!" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.body.userId = decoded.id; 
    next();
  } catch (error) {
    console.error(error);
    res
      .status(401)
      .json({ success: false, message: "Token invalid or expired" });
  }
};

export default authUser;
