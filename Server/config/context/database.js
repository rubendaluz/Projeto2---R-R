import { Sequelize } from "sequelize";


const projeto2_db = new Sequelize({
  host: "localhost",
  port: 3305,
  username: "admin",
  password: "admin123",
  database: "projeto2",
  dialect: "mysql", 
});

export { projeto2_db };