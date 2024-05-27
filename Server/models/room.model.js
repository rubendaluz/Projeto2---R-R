import { INTEGER, STRING, BOOLEAN, DATE } from "sequelize";
import { projeto2_db } from "../config/context/database.js";
import { FloorModel } from "./floor.model.js";

/**
 * Room Data 
 * id: INTEGER,
 * floor_id: INTEGER,
 * room_name: STRING
 */

const RoomsModel = projeto2_db.define('Rooms', {
  id: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  floor_id: {
    type: INTEGER,
    allowNull:false,
  },
  room_name: {
    type: STRING,
    allowNull: false,
  }
});

// Establish foreign key relationships
RoomsModel.belongsTo(FloorModel, { foreignKey: 'floor_id', onDelete: 'CASCADE' });

export { RoomsModel };