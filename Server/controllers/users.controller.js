import { UsersModel } from "../models/users.model.js";


import { createToken } from "../utils/jwt.js";
import { encrypt, compareHashes} from "../utils/crypto.js"

import path from 'path';
// import bcrypt from 'bcrypt';

import jwt from 'jsonwebtoken';


export const register = async (req, res) => {
  try {
    const { name, email, phone, username, role, password } = req.body;

    // Check if email is already in use
    const existingUser = await UsersModel.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    // Check if any users exist
    const userCount = await UsersModel.count();
    let assignedAccessLevel = role;

    // If no users exist, assign super admin access level
    if (userCount === 0) {
      assignedAccessLevel = 'super_admin'; // Adjust according to your access level naming
    }

    const hashedPassword = encrypt(password);

    const user = await UsersModel.create({
      name,
      email,
      phone,
      username,
      role: assignedAccessLevel,
      password: hashedPassword,
    });

    // Return user info excluding password
    return res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({ message: 'Failed to create user', error });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = encrypt(password);
  console.log("email: ", email);
  console.log("password: ", password);  
  console.log("hashedPassword: ", hashedPassword);
  
  const user = await UsersModel.findOne({ where: { email } });

  if (!user) {
    return res.status(401).json({ message: 'User not found' });
  }

  
  const passwordMatch = compareHashes(hashedPassword, user.password)

  if (!passwordMatch) {
    return res.status(401).json({ message: 'Invalid password' });
  }


  const token = createToken({
    id: user.id,
    email: user.email,
    batatas: 2,
  });

  //excluir password do user
  user.password = undefined;
  return res.json({ user, token });
};

export const editUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name,
      email,
      phone,
      username,
      role} = req.body;

    await UsersModel.update({name,
      email,
      phone,
      username,
      role}, { where: { id } });
    return res.json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ message: "Failed to update user"});
  }
}

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    // Delete the user
    await UsersModel.destroy({ where: { id } });

    return res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ message: "Failed to delete user" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const { sortOrder } = req.query;

    // Adicione opções de ordenação
    const order = [['name', sortOrder || 'ASC']]; 

    const users = await UsersModel.findAll({
      order: order,
      attributes: { exclude: ["password"] }
    });

    return res.json(users);
  } catch (error) {
    console.error("Error retrieving users:", error);
    return res.status(500).json({ message: "Failed to retrieve users" });
  }
};

const createResetToken = (userId) => {
  return jwt.sign({ userId }, '2222', { expiresIn: '1h' });
};


export const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UsersModel.findByPk(id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(user);
  } catch (error) {
    console.error("Error retrieving user:", error);
    return res.status(500).json({ message: "Failed to retrieve user" });
  }
};

export const searchUser = async (req, res) => {
  try {
    const { search } = req.params;

    const users = await UsersModel.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
          { phone: { [Op.like]: `%${search}%` } },
          { username: { [Op.like]: `%${search}%` } },
        ],
      },
      attributes: { exclude: ["password"] },
    },
    { include: [{ model: LocationModel, as: 'location' }] });

    return res.json(users);
  } catch (error) {
    console.error("Error searching users:", error);
    return res.status(500).json({ message: "Failed to search users" });
  }
};