import { Router } from "express";

import { usersRoutes} from "./users.routes.js";
import { objectsRoutes } from "./objects.routes.js";
import { locationRoutes } from "./locations.routes.js";
import { detectionRoutes } from "./detection.routes.js";
import { listCounts, getRoomDistributionData, getCategoryDistributionData } from "../controllers/statistics.controller.js";
import { objectsTypeRoutes } from "./categories.routes.js";


const api = Router();

// Routes for user functions
//http://localhost:4242/api/user
api.use("/user", usersRoutes);
//http://localhost:4242/api/objects
api.use("/objects", objectsRoutes);
//http://localhost:4242/api/categories
api.use("/categories", objectsTypeRoutes);
//http://localhost:4242/api/locations
api.use("/locations", locationRoutes);
//http://localhost:4242/api/detections
api.use("/detections", detectionRoutes);
//http://localhost:4242/api/statistics
api.get("/statistics", listCounts);
api.get("/statistics/room-distribution", getRoomDistributionData);
api.get("/statistics/category-distribution", getCategoryDistributionData);

export { api };