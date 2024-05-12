import { INTEGER, STRING, BOOLEAN, DATE } from "sequelize";
import { projeto2_db } from "../config/context/database.js";


const FloorModel = projeto2_db.define('Floors', {
  id: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  floor_name: {
    type: STRING,
    allowNull: false,
  }
});


export { FloorModel };