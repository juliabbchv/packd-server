import express from "express";

import {
  getAllTrips,
  getSingleTrip,
  getItemsForTrip,
  updateTripDetails,
  deleteTripDetails,
  addTripDetails,
  updateTripItems,
  addNewItem,
  deleteTripItem,
} from "../controllers/trips-controller.js";

const router = express.Router();

router.route("/").get(getAllTrips).post(addTripDetails);
router
  .route("/:id")
  .get(getSingleTrip)
  .patch(updateTripDetails)
  .delete(deleteTripDetails);
router
  .route("/:id/items")
  .get(getItemsForTrip)
  .patch(updateTripItems)
  .post(addNewItem);

// router.route("/:tripid/items/:itemid").delete(deleteTripItem);

export default router;
