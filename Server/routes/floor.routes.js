import { Router } from "express";

import { create } from "../controllers/floor.controller.js";

const floorRoutes = Router();

floorRoutes.post("/create", create);

export {floorRoutes}


