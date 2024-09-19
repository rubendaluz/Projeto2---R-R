import { INTEGER, STRING, BOOLEAN, DATE } from "sequelize";
import { projeto2_db } from "../config/context/database.js";



const LocationsModel = projeto2_db.define('Locations', {
  id: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: STRING,
    allowNull: false,
  },
  floor: {
    type: INTEGER,
    allowNull:false,
  },
  building: {
    type: STRING,
    allowNull: false,
  },
  description: {
    type: STRING,
    allowNull: true,
  }
  
});

export { LocationsModel };