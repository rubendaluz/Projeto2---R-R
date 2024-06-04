import { INTEGER, STRING, BOOLEAN, DATE } from "sequelize";
import { projeto2_db } from "../config/context/database.js";



const RoomsModel = projeto2_db.define('Rooms', {
  id: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  floor: {
    type: INTEGER,
    allowNull:false,
  },
  room_name: {
    type: STRING,
    allowNull: false,
  }
});

export { RoomsModel };