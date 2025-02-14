import "dotenv/config";
import express from "express";
import cors from "cors";
import openAIRoute from "./routes/opeai-route.js";
import tripsRoute from "./routes/trips-route.js";
import itemsRoute from "./routes/items-route.js";

const PORT = process.env.PORT || 5050;
const { CORS_ORIGIN } = process.env;

const app = express();
app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());

app.use("/api/packinglist", openAIRoute);
app.use("/trips", tripsRoute);
app.use("/items", itemsRoute);

app.listen(PORT, () => {
  console.log(`running at http://localhost:${PORT}`);
});
