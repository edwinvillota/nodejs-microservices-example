import { createContainer, asClass } from "awilix";
import { scopePerRequest } from "awilix-express";
import { Application } from "express";

// Services
import { OrderService } from "./services/order.service";

export default (app: Application) => {
  const container = createContainer({ injectionMode: "CLASSIC" });

  container.register({
    //Services
    orderService: asClass(OrderService).scoped(),
  });

  app.use(scopePerRequest(container));
};
