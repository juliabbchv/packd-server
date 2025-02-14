import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

//GET all trips

const getAllTrips = async (req, res) => {
  try {
    const data = await knex("trips");
    res.status(200).json(data);
  } catch {
    console.error("Error getting trips:", err);
    res.status(500).send("Error getting trips");
  }
};

const getSingleTrip = async (req, res) => {
  try {
    const tripId = req.params.id;
    const items = await knex("trips").where({
      id: tripId,
    });

    if (items.length === 0) {
      return res.status(404).send("No items were found for this trip");
    }

    res.status(200).json(items);
  } catch (err) {
    console.error("Error fetching items for the trip:", err);
    res.status(500).send("Error getting items for the trip");
  }
};

const getItemsForTrip = async (req, res) => {
  try {
    const tripId = req.params.id;
    const items = await knex("items").where({
      trip_id: tripId,
    });

    if (items.length === 0) {
      return res.status(404).send("No items were found for this trip");
    }

    res.status(200).json(items);
  } catch (err) {
    console.error("Error fetching items for the trip:", err);
    res.status(500).send("Error getting items for the trip");
  }
};

//GET user trips ??

const getTripsForUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const trips = await knex("trips").where({ user_id: userId });

    if (trips.length === 0) {
      return res.status(404).send("No trips found for this user");
    }

    res.status(200).json(trips);
  } catch (err) {
    console.error("Error getting trips for user:", err);
    res.status(500).send("Error getting trips for user");
  }
};

const getSingleTripForUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const tripId = req.params.id;
    const items = await knex("trips").where({
      id: tripId,
      user_id: userId,
    });

    if (items.length === 0) {
      return res.status(404).send("No trips found");
    }

    res.status(200).json(items);
  } catch (err) {
    console.error("Error fetching  trip:", err);
    res.status(500).send("Error getting trip");
  }
};

const getItemsForUserTrip = async (req, res) => {
  try {
    const userId = req.user.id;
    const tripId = req.params.id;
    const items = await knex("items").where({
      trip_id: tripId,
      user_id: userId,
    });

    if (items.length === 0) {
      return res.status(404).send("No items were found for this trip");
    }

    res.status(200).json(items);
  } catch (err) {
    console.error("Error fetching items for the trip:", err);
    res.status(500).send("Error getting items for the trip");
  }
};

// PATCH user trip details

const updateTripDetails = async (req, res) => {
  try {
    const tripId = req.params.id;
    const { trip_name, isSaved, isPublic } = req.body;
    const updatedRows = await knex("trips")
      .where({ id: tripId })
      .update({
        trip_name,
        isSaved: isSaved ? 1 : 0,
        isPublic: isPublic ? 1 : 0,
        updated_at: knex.fn.now(),
      });

    if (!tripId) {
      return res.status(404).json({ error: "Trip not found" });
    }

    const updatedTrip = await knex("trips").where({ id: tripId }).first();

    res.status(200).json(updatedTrip);
  } catch (err) {
    console.error("Error updating trip", err);
    res.status(500).send("Error updating trip details");
  }
};

// Delete user trip

const deleteTripDetails = async (req, res) => {
  try {
    const tripId = req.params.id;

    const trip = await knex("trips").where({ id: tripId }).first();
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    await knex("trips").where({ id: tripId }).delete();
    res
      .status(204)
      .json({ message: `Inventory with ID ${tripId} deleted successfully` });
  } catch (err) {
    console.error("Error deleting trip", err);
    res.status(500).json({ message: "Error deleting trip" });
  }
};

// Post trip details

const addTripDetails = async (req, res) => {
  const { id, ...params } = req.body;
  console.log(req.body);

  if (!params.destination || !params.user_id) {
    return res
      .status(400)
      .json({ message: "Please provide all required information" });
  }
  try {
    const result = await knex("trips").insert(params);
    const newTripId = result[0];
    const createdTrip = await knex("trips").where({ id: newTripId }).first();

    // add another knex call to items to then add items using tripID
    res.status(201).json(createdTrip);
  } catch (err) {
    console.error(`Error posting new trip`, err);
    res.status(500).json({ message: `There was an error making new trip` });
  }
};

// const addItemsForTrip = async (req, res) => {
//   const { id, trip_id, ...params } = req.body;

//   if (!params.destination || !params.trip_id || !params.user_id) {
//     return res
//       .status(400)
//       .json({ message: "Please provide all required information" });
//   }
//   try {
//     const result = await knex("items").insert(params);
//     const newItemId = result[0];
//     const createdItem = await knex("items").where({ id: newItemId }).first();
//     res.status(201).json(createdItem);
//   } catch (err) {
//     console.error(`Error posting new item`, err);
//     res.status(500).json({ message: `There was an error making new item` });
//   }
// };

export {
  getAllTrips,
  getItemsForTrip,
  getSingleTrip,
  updateTripDetails,
  deleteTripDetails,
  addTripDetails,
};
