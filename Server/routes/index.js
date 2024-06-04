import { Router } from "express";

import { usersRoutes} from "./users.routes.js";
import { objectsRoutes } from "./objects.routes.js";
import { roomRoutes } from "./rooms.routes.js";


const api = Router();

// Routes for user functions
//http://localhost/api/user
api.use("/user", usersRoutes);
api.use("/objects", objectsRoutes);
api.use("/rooms", roomRoutes);

export { api };