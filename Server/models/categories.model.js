import { INTEGER, STRING, BOOLEAN, DATE } from "sequelize";
import { projeto2_db } from "../config/context/database.js";

/**
 * Floor Data
 * id: INTEGER,
 *  floor_name: STRING
 */

const CategoriesModel = projeto2_db.define('Categories', {
  id: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: STRING,
    allowNull: false,
  },
  category_group_id: {
    type: INTEGER,
    allowNull:false
  },
  description: {
    type: STRING,
    allowNull:true
  }
});


export { CategoriesModel };