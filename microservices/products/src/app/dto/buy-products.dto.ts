import { Type } from "class-transformer";
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  Min,
  ValidateNested,
} from "class-validator";

class ProductItem {
  @IsNumber()
  @IsNotEmpty()
  id!: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  quantity!: number;
}

export class BuyProductsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => ProductItem)
  products!: ProductItem[];
}
