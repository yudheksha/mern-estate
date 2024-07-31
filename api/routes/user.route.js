import express from "express";
import {
  deleteUser,
  test,
  updateUser,
  getUserListings,
  getUser,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

// API Routes
router.get("/test", (req, res) => {
  console.log("/test route accessed");
  res.status(200).json({ message: "Test route accessed" });
});

router.post("/update/:id", verifyToken, (req, res, next) => {
  console.log("User ID from URL params:", req.params.id);
  console.log("User ID from token:", req.user.id);
  updateUser(req, res, next);
});

router.delete("/delete/:id", verifyToken, deleteUser);
router.get("/listings/:id", verifyToken, getUserListings);
router.get("/:id", verifyToken, getUser);

export default router;
