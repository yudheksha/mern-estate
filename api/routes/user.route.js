import express from "express";
import { deleteUser, test, updateUser, getUserListings } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

// API Route
// API Routes
router.get('/test', (req, res) => {
    console.log('/test route accessed');
    res.status(200).json({ message: 'Test route accessed' });
  });
  router.post("/update/:id", verifyToken, updateUser);
router.delete("/delete/:id", verifyToken, deleteUser);
router.get('/listings/:id', verifyToken, getUserListings);


export default router;
