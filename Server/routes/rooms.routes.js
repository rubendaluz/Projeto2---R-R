import { Router } from "express";

import { create, deleteRoom, getAllRooms } from "../controllers/room.controller.js";

const roomRoutes = Router();

http://localhost:4242/api/rooms/create
roomRoutes.post("/create", create);
http://localhost:4242/api/rooms/:id
roomRoutes.delete("/:id", deleteRoom);
http://localhost:4242/api/rooms/getallrooms
roomRoutes.get("/getallrooms", getAllRooms);


export {roomRoutes}