import express from "express";
import {
  getAllItems,
  deleteTripItem,
} from "../controllers/items-controller.js";

const router = express.Router();

router.route("/").get(getAllItems);
router.route("/:id").delete(deleteTripItem);

export default router;
