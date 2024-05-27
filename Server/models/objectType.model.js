import { INTEGER, STRING, BOOLEAN, DATE } from "sequelize";
import { projeto2_db } from "../config/context/database.js";

/**
 * object type Data
 * id: INTEGER,
 *  name: STRING
 */
const ObjectTypeModel = projeto2_db.define('Objects Types', {
  id: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: STRING,
    allowNull: false,
  }
});


export { ObjectTypeModel };