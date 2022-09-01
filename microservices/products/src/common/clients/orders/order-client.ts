import axios from "axios";
import { CreateOrderDto } from "./dto/create-order.dto";

export class OrderClient {
  private baseURL: string;

  constructor() {
    this.baseURL = `${process.env.ORDERS_SERVICE_URL}/orders`;
  }

  public async createOrder(body: CreateOrderDto) {
    return axios.post<Boolean>(this.baseURL, body);
  }
}
