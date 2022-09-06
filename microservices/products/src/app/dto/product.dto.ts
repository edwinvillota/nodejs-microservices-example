import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsBoolean,
  IsOptional,
} from "class-validator";

export class ProductDto {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  category!: string;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  price!: number;

  @IsString()
  @IsOptional()
  photo?: string;

  @IsBoolean()
  @IsOptional()
  deleted?: boolean;
}
