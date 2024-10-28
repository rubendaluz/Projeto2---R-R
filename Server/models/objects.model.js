import { INTEGER, STRING, BOOLEAN, DATE } from "sequelize";
import { projeto2_db } from "../config/context/database.js";
import { LocationsModel} from "./locations.model.js"
import {CategoriesModel} from "./categories.model.js"

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
   name: {
    type: STRING,
    allowNull: false,
  },
  location_id: {
    type: INTEGER,
    allowNull: false,
  },
  category_id: {
    type: INTEGER,
    allowNull: false,
  },
  uhfTag: {
    type: STRING,
    allowNull: true,
  },
  description: {
    type: STRING,
    allowNull: true,
  }
});

// Establish foreign key relationships
ObjectsModel.belongsTo(LocationsModel, { foreignKey: 'location_id', as: 'location', onDelete: 'CASCADE' });
ObjectsModel.belongsTo(CategoriesModel, { foreignKey: 'category_id', as: 'category', onDelete: 'CASCADE' });

export { ObjectsModel };