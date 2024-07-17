import express from 'express';
import { createListing, deleteListing, updateListing } from '../controllers/listing.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

const validateObjectId = (req, res, next) => {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid ObjectId format" });
    }
    next();
  };

router.post('/create', verifyToken, createListing);
router.delete('/delete/:id', verifyToken, deleteListing);
router.post('/update/:id', verifyToken, updateListing);

export default router;