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
    res.status(200).json("Listing has been deleted!");
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
      return next(errorHandler(404, "Listing not found!"));
    }

    if (req.user.id !== listing.userRef.toString()) {
      return next(errorHandler(401, "You can only update your own listings!"));
    }

    const updatedListing = await Listing.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    console.log(`Listing updated successfully for id: ${id}`);
    res.status(200).json(updatedListing);
  } catch (error) {
    console.error(`Error updating listing for id: ${id}`, error);
    next(error);
  }
};

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, "Listing not found!"));
    }

    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    let offer = req.query.offer === "true" ? true : { $in: [false, true] };
    let furnished =
      req.query.furnished === "true" ? true : { $in: [false, true] };
    let parking = req.query.parking === "true" ? true : { $in: [false, true] };
    let type =
      req.query.type && req.query.type !== "all"
        ? req.query.type
        : { $in: ["sale", "rent"] };
    const searchTerm = req.query.searchTerm || "";
    const sort = req.query.sort || "createdAt";
    const order = req.query.order || "desc";

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: "i" },
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: order })
      .skip(startIndex)
      .limit(limit);

    // Remove duplicates if any
    const uniqueListings = listings.filter(
      (v, i, a) =>
        a.findIndex((t) => t._id.toString() === v._id.toString()) === i
    );

    return res.status(200).json(uniqueListings);
  } catch (error) {
    next(error);
  }
};
