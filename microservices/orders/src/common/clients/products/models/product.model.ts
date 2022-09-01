import { Type } from "class-transformer";
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from "class-validator";

export class Product {
  @IsNumber()
  id!: number;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  category!: string;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  @Type(() => Number)
  price!: number;

  @IsString()
  @IsOptional()
  photo?: string;

  @IsBoolean()
  @IsOptional()
  deleted?: boolean;
}
