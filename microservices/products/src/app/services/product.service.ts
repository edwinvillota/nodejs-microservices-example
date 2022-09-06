import { AwilixContainer } from "awilix";
import { ModelStatic } from "sequelize/types";
import { OrderProduct } from "../common/clients/orders/dto/create-order.dto";
import { OrderClient } from "../common/clients/orders/order-client";
import { ConflictException } from "../common/exceptions/conflict-exception";
import { BuyProductsDto } from "../dto/buy-products.dto";
import { ProductDto } from "../dto/product.dto";
import { Product } from "../models/product.model";

export class ProductService {
  constructor(
    private readonly orderClient: OrderClient,
    private readonly productModel: ModelStatic<Product>
  ) {}

  private findProductById(id: number) {
    return this.productModel.findByPk(id);
  }

  public async getProductById(id: number) {
    const productFound = await this.findProductById(id);

    if (!productFound) {
      throw new ConflictException(`User with id: ${id}, doesn't exists`);
    }

    return productFound;
  }

  public async getProducts() {
    return this.productModel.findAll({ where: { deleted: false } });
  }

  public async createProduct(product: ProductDto) {
    const newProduct = this.productModel.build(product);
    return newProduct.save();
  }

  public async updateProduct(
    id: number,
    { id: requestedId, ...product }: ProductDto
  ) {
    const currentProduct = await this.findProductById(id);

    if (currentProduct) {
      return currentProduct.update(product);
    }

    return this.createProduct(product);
  }

  public async deleteProduct(id: number) {
    const productFound = await this.findProductById(id);

    if (!productFound) {
      throw new ConflictException(`Product with id: ${id} doesn't exists`);
    }

    if (productFound.deleted) {
      throw new ConflictException(
        `Product with id: ${id} has already been deleted`
      );
    }

    productFound.deleted = true;

    return productFound.save();
  }

  public async restoreProduct(id: number) {
    const productFound = await this.findProductById(id);

    if (!productFound) {
      throw new ConflictException(`Product with id: ${id} doesn't exists`);
    }

    if (!productFound.deleted) {
      throw new ConflictException(
        `Product with id: ${id} has not been deleted`
      );
    }

    productFound.deleted = false;

    return productFound.save();
  }

  public async buyProducts({ products }: BuyProductsDto) {
    const orderProducts: OrderProduct[] = [];

    for (const product of products) {
      const productExists = await this.findProductById(product.id);

      if (!productExists) {
        throw new ConflictException(
          `Product with id: ${product.id} doesn't exists`
        );
      }

      orderProducts.push({
        ...productExists.toJSON(),
        quantity: product.quantity,
      } as OrderProduct);
    }

    const { data } = await this.orderClient.createOrder({
      products: orderProducts,
    });

    return data;
  }
}
