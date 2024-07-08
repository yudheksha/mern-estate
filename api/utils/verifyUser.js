import { errorHandler } from "./error.js";
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  console.log("verifyToken middleware executed");
  console.log("Headers:", req.headers);
  console.log("Cookies:", req.cookies);
  const token = req.cookies.access_token;
  console.log("Token:", token);
  console.log("verify Token is successful")

  if (!token) {
    console.log('No token provided');
    return next(errorHandler(401, "Unauthorized"));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log('Token verification failed');
      return next(errorHandler(403, "Forbidden"));
    }

    req.user = user;
    console.log('Token verified, user:', user);
    next();
  });
};
