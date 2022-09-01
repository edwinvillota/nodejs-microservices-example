import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, ValidateNested } from "class-validator";
import { Product } from "../common/clients/products/models/product.model";

export class OrderProduct extends Product {
  quantity!: number;
}

export class CreateOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => OrderProduct)
  products!: OrderProduct[];
}
