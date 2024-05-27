import { INTEGER, STRING, BOOLEAN, DATE } from "sequelize";
import { projeto2_db } from "../config/context/database.js";
import { RoomsModel } from "./room.model.js"
import {ObjectTypeModel} from "./objectType.model.js"

/**
 * Objects Data
 * id: INTEGER,
 * room_id: INTEGER,
 * object_type_id: INTEGER,
 * description: STRING
 */


const ObjectsModel = projeto2_db.define('Objects', {
  id: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  room_id: {
    type: INTEGER,
    allowNull: false,
  },
  object_type_id: {
    type: INTEGER,
    allowNull: false,
  },
  description: {
    type: STRING,
    allowNull: true,
  }
});

// Establish foreign key relationships
ObjectsModel.belongsTo(RoomsModel, { foreignKey: 'room_id', onDelete: 'CASCADE' });
ObjectsModel.belongsTo(ObjectTypeModel, { foreignKey: 'object_type_id', onDelete: 'CASCADE' });

export { ObjectsModel };