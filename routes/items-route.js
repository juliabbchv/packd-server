import express from "express";
import { getAllItems } from "../controllers/items-controller.js";

const router = express.Router();

router.route("/").get(getAllItems);

export default router;
