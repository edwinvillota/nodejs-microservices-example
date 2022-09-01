import express, { Application } from "express";
import path from "path";
import fs from "fs";
import cors from "cors";
import loadContainer from "../../container";
import { loadControllers } from "awilix-express";
import { db } from "../persistence/mysql.persistence";
import swaggerUi from "swagger-ui-express";

export class Server {
  private app: Application;
  private port: string;
  private basePath: string;
  private swaggerFile: string;
  private swaggerData: string;
  private swaggerDocument: any;

  constructor() {
    this.app = express();
    this.port = process.env.PORT || "3003";
    this.basePath = "/api/v1";
    this.swaggerFile = path.join(__dirname, `../../docs/swagger.json`);
    this.swaggerData = fs.readFileSync(this.swaggerFile, "utf8");
    this.swaggerDocument = JSON.parse(this.swaggerData);

    // Load dependencies container
    loadContainer(this.app);

    // Load DB
    this.dbConnection();

    // Load middlewares
    this.middlewares();

    // Load controllers
    this.controllers();

    // Load documents
    this.swagger();
  }

  private middlewares() {
    this.app.use(cors());
    this.app.use(express.json());
  }

  private controllers() {
    this.app.use(
      this.basePath,
      loadControllers("../../controllers/*.ts", {
        cwd: __dirname,
      })
    );
  }

  private async dbConnection() {
    try {
      await db.authenticate();
      console.log("Connected to database fast_service_orders");
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  private swagger() {
    this.app.use(
      "/api/docs",
      swaggerUi.serve,
      swaggerUi.setup(this.swaggerDocument)
    );
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`Products API running on port ${this.port}`);
    });
  }
}
