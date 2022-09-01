const path = require("path");
require("dotenv").config({
  path: path.join(__dirname, `../env/${process.env.NODE_ENV}.env`),
});

import "reflect-metadata";

import { Server } from "./common/clases/server";

const server = new Server();

server.listen();
