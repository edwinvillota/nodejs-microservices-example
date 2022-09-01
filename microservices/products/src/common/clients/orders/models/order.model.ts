import { Product } from "../../../../models/product.model";

export class Order {
  id!: number;
  user!: string;
  products!: Product[];
  createdAt!: Date;
  updatedAt!: Date;
}
