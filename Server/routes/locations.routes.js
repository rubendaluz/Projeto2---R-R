import { Router } from "express";
import { authRequired } from "../utils/jwt.js";
import { create, deleteLocation, getAllLocations,getAllLocationByFloor, getLocationsbyId, updateLocation } from "../controllers/locations.controller.js";

const locationRoutes = Router();

// http://localhost:4242/api/locations/create
locationRoutes.post("/",authRequired, create);
// http://localhost:4242/api/locations/:id
locationRoutes.delete("/:id",authRequired, deleteLocation);
// http://localhost:4242/api/locations/
locationRoutes.get("/", authRequired, getAllLocations);
locationRoutes.get("/:id", authRequired, getLocationsbyId);
locationRoutes.put("/:id", authRequired, updateLocation);
//http://localhost:4242/api/Locations/getallLocationsByFloor/:floor
locationRoutes.get("/LocationByFloor/:floor", authRequired, getAllLocationByFloor);


export {locationRoutes}