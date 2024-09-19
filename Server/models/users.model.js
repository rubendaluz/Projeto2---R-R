import { INTEGER, STRING, BOOLEAN, DATE } from "sequelize";
import { projeto2_db } from "../config/context/database.js";


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
    },
  phone: {
      type: STRING,
      allowNull: true,
  },
  password: {
    type: STRING,
    allowNull: false,
  },
  role: {
    type: STRING,
    allowNull: false,
  }
});


export { UsersModel };