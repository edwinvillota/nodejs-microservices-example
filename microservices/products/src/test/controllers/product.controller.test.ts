import { ProductController } from "../../app/controllers/product.controller";
import { Product } from "../../app/models/product.model";

const someProductsMock = [
  {
    id: 1,
    name: "Test 1",
    price: 10,
    category: "Mocks",
  },
  {
    id: 2,
    name: "Test 2",
    price: 20,
    category: "Mocks",
  },
  {
    id: 3,
    name: "Test 3",
    price: 30,
    category: "Mocks",
  },
  {
    id: 4,
    name: "Test 1",
    price: 40,
    category: "Mocks",
  },
] as Product[];

describe("Product controller test suite", () => {
  let productController: ProductController;

  const requestMock = {};

  const responseMock = {
    status: jest.fn(),
    send: jest.fn(),
  };

  const productServiceMock = {
    getProducts: jest.fn(),
  };

  beforeEach(() => {
    productController = new ProductController(productServiceMock as any);
  });

  test("Should return a list of products", async () => {
    productServiceMock.getProducts.mockResolvedValueOnce(someProductsMock);

    await productController.getProducts(
      requestMock as any,
      responseMock as any
    );

    expect(responseMock.status).toBeCalledWith(200);
    expect(responseMock.send).toBeCalledWith(someProductsMock);
  });
});
