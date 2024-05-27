import { INTEGER, STRING, BOOLEAN, DATE } from "sequelize";
import { projeto2_db } from "../config/context/database.js";

/**
 * user Data
 * id: INTEGER,
 * name: STRING,
 * email: STRING,
 * phone: STRING,
 * username: STRING,
 * password: STRING,
 * access_level: BOOLEAN
 */




const UsersModel = projeto2_db.define('Users', {
  id: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: STRING,
    allowNull: false,
  },
  email: {
    type: STRING,
    allowNull: false,
    unique:true,
    },
  phone: {
      type: STRING,
      allowNull: true,
  },
  username: {
    type: STRING,
    allowNull: false,
    unique:true,
    },
  password: {
    type: STRING,
    allowNull: false,
    unique: true,
  },
  access_level: {
    type: BOOLEAN,
    allowNull: false,
  }
});


export { UsersModel };