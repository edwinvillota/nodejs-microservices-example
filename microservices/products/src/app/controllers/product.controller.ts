import { Response, Request } from "express";
import { before, DELETE, GET, PATCH, POST, PUT, route } from "awilix-express";
import { ProductService } from "../services/product.service";
import { TypedRequestBody } from "../common/interfaces/typed-request-body";
import { ProductDto } from "../dto/product.dto";
import validateDto from "../common/middlewares/validate-dto";
import { BaseController } from "../common/controllers/base.controller";
import validateToken from "../common/middlewares/validate-token";
import { BuyProductsDto } from "../dto/buy-products.dto";

@route("/products")
@before(validateToken)
export class ProductController extends BaseController {
  constructor(private productService: ProductService) {
    super();
  }

  @GET()
  public async getProducts(_: Request, res: Response) {
    try {
      const products = await this.productService.getProducts();
      res.status(200);
      res.send(products);
    } catch (error) {
      this.handleException(error, res);
    }
  }

  @POST()
  @route("/buy")
  @before(validateDto(BuyProductsDto))
  public async buyProducts(
    req: TypedRequestBody<BuyProductsDto>,
    res: Response
  ) {
    try {
      const result = await this.productService.buyProducts(req.body);
      res.status(200);
      res.send(result);
    } catch (error) {
      this.handleException(error, res);
    }
  }

  @GET()
  @route("/:id")
  public async getProductById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const productFound = await this.productService.getProductById(+id);

      res.status(200);
      res.send(productFound);
    } catch (error) {
      this.handleException(error, res);
    }
  }

  @POST()
  @before(validateDto(ProductDto))
  public async createProduct(req: TypedRequestBody<ProductDto>, res: Response) {
    try {
      const product = req.body;
      const createdProduct = await this.productService.createProduct(product);
      res.status(201);
      res.send(createdProduct);
    } catch (error) {
      this.handleException(error, res);
    }
  }

  @PUT()
  @route("/:id")
  @before(validateDto(ProductDto))
  public async updateProduct(req: TypedRequestBody<ProductDto>, res: Response) {
    try {
      const product = req.body;
      const { id } = req.params;

      const updatedProduct = await this.productService.updateProduct(
        +id,
        product
      );
      res.status(200);
      res.send(updatedProduct);
    } catch (error) {
      this.handleException(error, res);
    }
  }

  @PATCH()
  @route("/restore/:id")
  public async restoreProduct(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const restoredProduct = await this.productService.restoreProduct(+id);
      res.send(200);
      res.send(restoredProduct);
    } catch (error) {
      this.handleException(error, res);
    }
  }

  @DELETE()
  @route("/:id")
  public async deleteProduct(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deletedProduct = await this.productService.deleteProduct(+id);
      res.status(200);
      res.send(deletedProduct);
    } catch (error) {
      this.handleException(error, res);
    }
  }
}
