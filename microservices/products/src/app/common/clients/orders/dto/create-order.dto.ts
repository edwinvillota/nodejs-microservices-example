import { Product } from "../../../../models/product.model";

export class OrderProduct extends Product {
  quantity?: number;
}

export class CreateOrderDto {
  products!: OrderProduct[];
}
