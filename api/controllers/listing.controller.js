import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";
import { isValidObjectId } from "../utils/objectIdValidator.js";


export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(errorHandler(404, "Listing not found!"));
  }

  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, "You can only delete your own listings!"));
  }

  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json('Listing has been deleted!');
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  const { id } = req.params;
  console.log(`Update listing requested for id: ${id}`);

  if (!isValidObjectId(id)) {
    console.error(`Invalid ObjectId: ${id}`);
    return next(errorHandler(400, "Invalid listing ID!"));
  }

  try {
    const listing = await Listing.findById(id);
    if (!listing) {
      console.error(`Listing not found for id: ${id}`);
      return next(errorHandler(404, 'Listing not found!'));
    }

    if (req.user.id !== listing.userRef.toString()) {
      return next(errorHandler(401, "You can only update your own listings!"));
    }

    const updatedListing = await Listing.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    console.log(`Listing updated successfully for id: ${id}`);
    res.status(200).json(updatedListing);
  } catch (error) {
    console.error(`Error updating listing for id: ${id}`, error);
    next(error);
  }
};