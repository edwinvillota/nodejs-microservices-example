import { createContainer, asClass, asValue } from "awilix";
import { scopePerRequest } from "awilix-express";
import { Application } from "express";
import { OrderClient } from "./common/clients/orders/order-client";

// Services
import { ProductService } from "./services/product.service";
import { Product } from "./models/product.model";

export default (app: Application) => {
  const container = createContainer({ injectionMode: "CLASSIC" });
  container.register({
    //Services
    productService: asClass(ProductService).scoped(),

    //Clients
    orderClient: asClass(OrderClient).scoped(),

    // Models
    productModel: asValue(Product),
  });

  app.use(scopePerRequest(container));
};
