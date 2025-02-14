import express from "express";
import mockAuth from "../mockAuth.js";
import {
  getAllTrips,
  getSingleTrip,
  getItemsForTrip,
  updateTripDetails,
  deleteTripDetails,
  addTripDetails,
} from "../controllers/trips-controller.js";

const router = express.Router();

router.route("/").get(getAllTrips).post(addTripDetails);
router
  .route("/:id")
  .get(getSingleTrip)
  .patch(updateTripDetails)
  .delete(deleteTripDetails);
router.route("/:id/items").get(getItemsForTrip);

// Mock Auth
// router.route("/user").get(mockAuth, getTripsForUser);
// router.route("/user/:id").get(mockAuth, getSingleTripForUser);
// router.route("/user/:id/items/").get(mockAuth, getItemsForUserTrip);

export default router;
