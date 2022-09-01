import { createContainer, asClass } from "awilix";
import { scopePerRequest } from "awilix-express";
import { Application } from "express";
import { OrderClient } from "./common/clients/orders/order-client";

// Services
import { ProductService } from "./services/product.service";

export default (app: Application) => {
  const container = createContainer({ injectionMode: "CLASSIC" });

  container.register({
    //Services
    productService: asClass(ProductService).scoped(),

    //Clients
    orderClient: asClass(OrderClient).scoped(),
  });

  app.use(scopePerRequest(container));
};
