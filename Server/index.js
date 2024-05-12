// Importar node packages
import express from "express";
import cors from "cors";
import morgan from "morgan";
import "dotenv/config";


// SERVER ROUTES
import { api } from "./routes/index.js";
//SERVER DATABASE
import { projeto2_db } from "./config/context/database.js";

//--REST SERVER--//
const server = express();


const clientURL = "*";

// CORS options
const corsOptions = {
  origin: clientURL,
};
server.use(cors(corsOptions));

// output dados de pedido HTTP - logger
server.use(morgan("short"));

// Add this line to serve our index.html page
server.use(express.static('public'));

// parse dados dos pedidos no content-type - application/json
server.use(express.json());
server.use(express.urlencoded({ extended: true }));


server.use("/api", api);

//Fazer ligação à Base de Dados
// npm install --save mysql2
try {
  projeto2_db.sync({ force: false, alter: true });
} catch (error) {
  console.info(error);
}

// correr server no url host:port definido em .env
server.listen(process.env.SERVER_PORT, process.env.SERVER_HOST, () => {
  console.log(
    "Server up and running at http://%s:%s",
    process.env.SERVER_HOST,
    process.env.SERVER_PORT
  );
});