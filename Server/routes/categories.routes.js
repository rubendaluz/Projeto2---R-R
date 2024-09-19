import { Router } from "express";

import {createObjectType, deleteObjectType,listTypes } from "../controllers/objects.controller.js";

const objectsTypeRoutes = Router();

// http://localhost:4242/api/objects/
objectsTypeRoutes.post("/", createObjectType);
// http://localhost:4242/api/
objectsTypeRoutes.delete("/:id", deleteObjectType);
// http://localhost:4242/api/objects/objecttype
objectsTypeRoutes.get("/", listTypes);

export { objectsTypeRoutes };