import { Router } from "express";

import { create, readUhfTag, list, editObject, deleteObject,getObject, deleteObjectType,listTypes } from "../controllers/objects.controller.js";
import { authRequired } from "../utils/jwt.js";

const objectsRoutes = Router();

// http://localhost:4242/api/objects/create
objectsRoutes.post("/create",authRequired, create);
// http://localhost:4242/api/objects/addTag
objectsRoutes.post("/addTag", readUhfTag);
// http://localhost:4242/api/objects/
objectsRoutes.get("/", list);
// http://localhost:4242/api/objects/:id
objectsRoutes.put("/:id", editObject);
// http://localhost:4242/api/objects/:id
objectsRoutes.get("/:id", getObject);
// http://localhost:4242/api/objects/:id
objectsRoutes.delete("/:id", deleteObject);


export {objectsRoutes}