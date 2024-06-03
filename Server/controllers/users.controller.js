import { UsersModel } from "../models/users.model.js";


import { createToken } from "../utils/jwt.js";
import { encrypt, compareHashes} from "../utils/crypto.js"

import path from 'path';
// import bcrypt from 'bcrypt';

import jwt from 'jsonwebtoken';


export const register = async (req, res) => {

  try {
    const { name, email, phone, username, access_level, password } = req.body;

    // Verificar se o email já está em uso
    const existingUser = await UsersModel.findOne({ where: { email } });
  
    if (existingUser) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    const hashedPassword = await encrypt(password);

    const user = await UsersModel.create({
      name,    
      email,
      phone,
      username,
      access_level,
      password: hashedPassword,
    });

    // Geração e envio do link temporário para mudança de senha
    const Token = createToken(user.id);
    console.log("Token: ", Token);

// return just user info esclude password
    return res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        accessLevel: user.access_level,   
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


