import { CreateOrderDto } from "../dto/create-order.dto";
import { Order } from "../models/order.model";
import { OrderProduct } from "../models/order-product.model";
import { ConflictException } from "../common/exceptions/conflict-exception";

export class OrderService {
  constructor() {}

  private findOrderById(id: number) {
    return Order.findByPk(id, { include: "order_products" });
  }

  public async getOrders() {
    return Order.findAll({ include: "order_products" });
  }

  public async getOrderById(id: number) {
    return this.findOrderById(id);
  }

  public async createOrder({ products }: CreateOrderDto, user: string) {
    const newOrder = Order.build({ user });
    await newOrder.save();

    for (const { id, ...product } of products) {
      await OrderProduct.create({
        order_id: newOrder.id,
        product_id: id,
        ...product,
      });
    }

    return this.findOrderById(newOrder.id);
  }

  public async deleteOrder(id: number) {
    const orderExists = await this.findOrderById(id);

    if (!orderExists) {
      throw new ConflictException(`Order with id: ${id} doesn't exists`);
    }

    return orderExists.destroy();
  }
}
