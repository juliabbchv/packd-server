import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

//GET all trips

const getAllTrips = async (req, res) => {
  try {
    const data = await knex("trips")
      .select("trips.*", "users.name as user_name")
      .join("users", "trips.user_id", "=", "users.id");
    res.status(200).json(data);
  } catch {
    console.error("Error getting trips:", err);
    res.status(500).send("Error getting trips");
  }
};

const getSingleTrip = async (req, res) => {
  try {
    const tripId = req.params.id;
    const items = await knex("trips")
      .select("trips.*", "users.name as user_name")
      .join("users", "trips.user_id", "=", "users.id")
      .where("trips.id", tripId);

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

// PATCH

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

const updateTripItems = async (req, res) => {
  try {
    const tripId = req.params.id;
    const { id, item, link, quantity } = req.body;
    const updatedRows = await knex("items")
      .where({ id, trip_id: tripId })
      .update({
        item,
        link,
        quantity,
        updated_at: knex.fn.now(),
      });

    const itemExists = await knex("items")
      .where({ id, trip_id: tripId })
      .first();
    if (!itemExists) {
      return res.status(404).json({ error: "Item not found" });
    }

    const updatedTrip = await knex("items").where({ id: id }).first();

    res.status(200).json(updatedTrip);
  } catch (err) {
    console.error("Error updating item", err);
    res.status(500).send("Error updating item details");
  }
};

// DELETE

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
      .json({ message: `Trip with ID ${tripId} deleted successfully` });
  } catch (err) {
    console.error("Error deleting trip", err);
    res.status(500).json({ message: "Error deleting trip" });
  }
};

// POST

const addTripDetails = async (req, res) => {
  const { id, list, ...params } = req.body;
  const cleanedList = list.flat();

  if (!params.destination || !params.user_id) {
    return res
      .status(400)
      .json({ message: "Please provide all required information" });
  }

  try {
    const result = await knex("trips").insert(params);
    const newTripId = result[0];

    const createdTrip = await knex("trips").where({ id: newTripId }).first();

    res.status(201).json(createdTrip);

    try {
      await knex("items").insert(
        cleanedList.map(({ item, category, link, quantity }) => ({
          user_id: 1,
          item: item || "Unknown Item",
          trip_id: newTripId,
          category: category || "Uncategorized",
          link: link || null,
          quantity: quantity || null,
        }))
      );
    } catch (itemError) {
      console.error("Error inserting items:", itemError);
    }
  } catch (err) {
    console.error(`Error posting new trip`, err);
    res.status(500).json({ message: `There was an error making new trip` });
  }
};

const addNewItem = async (req, res) => {
  const { id, trip_id, ...params } = req.body;

  if (!params.item || !trip_id) {
    return res
      .status(400)
      .json({ message: "Please provide all required information" });
  }

  try {
    const result = await knex("items").insert({ ...params, trip_id });

    const newItemId = result[0];

    const createdItem = await knex("items").where({ id: newItemId }).first();

    res.status(201).json(createdItem);
  } catch (err) {
    console.error(`Error posting new item`, err);
    res
      .status(500)
      .json({ message: `There was an error creating the new item` });
  }
};

export {
  getAllTrips,
  getItemsForTrip,
  getSingleTrip,
  updateTripDetails,
  deleteTripDetails,
  addTripDetails,
  updateTripItems,
  addNewItem,
  deleteTripItem,
};
