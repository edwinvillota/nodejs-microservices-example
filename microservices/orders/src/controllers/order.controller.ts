import { Response, Request } from "express";
import { before, DELETE, GET, POST, PUT, route } from "awilix-express";
import validateDto from "../common/middlewares/validate-dto";
import { BaseController } from "../common/controllers/base.controller";
import validateToken from "../common/middlewares/validate-token";
import { OrderService } from "../services/order.service";
import { CreateOrderDto } from "../dto/create-order.dto";
import { RequestWithUser } from "../common/interfaces/request-with-user";

@route("/orders")
@before(validateToken)
export class ProductController extends BaseController {
  constructor(private orderService: OrderService) {
    super();
  }

  @GET()
  public async getOrders(_: Request, res: Response) {
    try {
      const orders = await this.orderService.getOrders();

      res.status(200).send(orders);
    } catch (error) {
      this.handleException(error, res);
    }
  }

  @GET()
  @route("/:id")
  public async getOrderById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const order = await this.orderService.getOrderById(+id);

      res.status(200).send(order);
    } catch (error) {
      this.handleException(error, res);
    }
  }

  @POST()
  @before(validateDto(CreateOrderDto))
  public async createOrder(
    req: RequestWithUser<CreateOrderDto>,
    res: Response
  ) {
    try {
      const createdOrder = await this.orderService.createOrder(
        req.body,
        req.user
      );

      res.status(201).json(createdOrder);
    } catch (error) {
      this.handleException(error, res);
    }
  }

  @DELETE()
  @route("/:id")
  public async deleteOrder(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await this.orderService.deleteOrder(+id);

      res.status(201).send(result);
    } catch (error) {
      this.handleException(error, res);
    }
  }
}
