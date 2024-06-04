import { Router } from "express";

import { register, deleteUser, login, getAllUsers, getUserProfile } from "../controllers/users.controller.js";


const usersRoutes = Router();

http://localhost:4242/api/user/register
usersRoutes.post("/register", register);
http://localhost:4242/api/user/:id
usersRoutes.delete("/:id", deleteUser);
http://localhost:4242/api/user/login
usersRoutes.post("/login", login);
http://localhost:4242/api/user/
usersRoutes.get("/", getAllUsers);
http://localhost:4242/api/user/:id
usersRoutes.get("/:id", getUserProfile);

export { usersRoutes };
