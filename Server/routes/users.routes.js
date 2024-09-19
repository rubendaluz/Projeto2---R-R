import { Router } from "express";

import { register, editUser, deleteUser, login, getAllUsers, getUserProfile,searchUser} from "../controllers/users.controller.js";
import { authRequired } from "../utils/jwt.js";


const usersRoutes = Router();

// http://localhost:4242/api/user/register
usersRoutes.post("/register", register);
// http://localhost:4242/api/user/:id
usersRoutes.put("/:id",authRequired, editUser);
// http://localhost:4242/api/user/:id
usersRoutes.delete("/:id", deleteUser);
// http://localhost:4242/api/user/login
usersRoutes.post("/login", login);
// http://localhost:4242/api/user/
usersRoutes.get("/", getAllUsers);
// http://localhost:4242/api/user/:id
usersRoutes.get("/:id", getUserProfile);
//--http://localhost:4242/api/user/
usersRoutes.get("/", authRequired, getAllUsers);
//--http://localhost:4242/api/user/search/{search}
usersRoutes.get("/search/:search", authRequired, searchUser);



export { usersRoutes };
