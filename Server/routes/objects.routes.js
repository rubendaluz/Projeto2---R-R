import { Router } from "express";

import { create } from "../controllers/objects.controller.js";

const objectsRoutes = Router();

objectsRoutes.post("/create", create);

export {objectsRoutes}