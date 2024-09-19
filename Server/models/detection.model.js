import { DATE, INTEGER, STRING } from "sequelize";
import { projeto2_db } from "../config/context/database.js";
import { LocationsModel} from "./locations.model.js"
import { ObjectsModel } from "./objects.model.js";


const Detections = projeto2_db.define('Detections', {
  id: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  object_id: {
    type: INTEGER,
    allowNull: false,
  },
  last_location_id: {
    type: INTEGER,
    allowNull: false,
  },
  current_location_id: {
    type: INTEGER,
    allowNull: false,
  },
  type: {
    type: STRING,
    allowNull: false,
  },
  description: {
    type: STRING,
    allowNull: true,
  },
  timestamp: {
    type: DATE,
    allowNull: false,
  }
});

// Establish foreign key relationships
Detections.belongsTo(ObjectsModel, { foreignKey: 'object_id', as: 'object', onDelete: 'CASCADE' });
Detections.belongsTo(LocationsModel, { foreignKey: 'last_location_id', as: 'old_room', onDelete: 'CASCADE' });
Detections.belongsTo(LocationsModel, { foreignKey: 'current_location_id', as: 'new_room', onDelete: 'CASCADE' });


export { Detections };