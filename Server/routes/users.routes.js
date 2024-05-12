import { Router } from "express";

import { register, deleteUser, login, getAllUsers } from "../controllers/users.controller.js";


const usersRoutes = Router();

usersRoutes.post("/register", register);
usersRoutes.delete("/:id", deleteUser);
usersRoutes.post("/login", login);
usersRoutes.get("/", getAllUsers);

export { usersRoutes };
