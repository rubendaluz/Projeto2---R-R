import { Router } from "express";

import { create, list, createObjectType, deleteObject, deleteObjectType } from "../controllers/objects.controller.js";

const objectsRoutes = Router();

http://localhost:4242/api/objects/create
objectsRoutes.post("/create", create);
http://localhost:4242/api/objects/createType
objectsRoutes.post("/createType", createObjectType);
http://localhost:4242/api/objects/
objectsRoutes.get("/", list);
http://localhost:4242/api/objects/:id
objectsRoutes.delete("/:id", deleteObject);
http://localhost:4242/api/objects/objecttype/:id
objectsRoutes.delete("/objecttype/:id", deleteObjectType);

export {objectsRoutes}