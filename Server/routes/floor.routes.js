import { Router } from "express";

import { create, deleteFloor } from "../controllers/floor.controller.js";

const floorRoutes = Router();

//http://localhost/api/floor/create
floorRoutes.post("/create", create);
//http://localhost/api/floor/:id
floorRoutes.post("/:id", deleteFloor);

export {floorRoutes}


