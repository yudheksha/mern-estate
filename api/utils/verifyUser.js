import { errorHandler } from "./error.js";
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  console.log("verifyToken middleware executed");
  console.log("Headers:", req.headers);
  console.log("Cookies:", req.cookies);
  const token = req.cookies.access_token;
  console.log("Token:", token);

  if (!token) return next(errorHandler(401, "Unauthorized"));

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(errorHandler(403, "Forbidden"));

    req.user = user;
    next();
  });
};
