import express from "express";
import { getAllItems } from "../controllers/items-controller.js";
import { deleteTripItem } from "../controllers/trips-controller.js";

const router = express.Router();

router.route("/").get(getAllItems);
router.route("/:id").delete(deleteTripItem);

export default router;
