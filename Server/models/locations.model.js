import { INTEGER, STRING, BOOLEAN, DATE } from "sequelize";
import { projeto2_db } from "../config/context/database.js";

/**
 * Room Data 
 * id: INTEGER,
 * floor_id: INTEGER,
 * room_name: STRING
 */


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