import { ConflictException } from "../../app/common/exceptions/conflict-exception";
import { BuyProductsDto } from "../../app/dto/buy-products.dto";
import { ProductDto } from "../../app/dto/product.dto";
import { Product } from "../../app/models/product.model";
import { ProductService } from "../../app/services/product.service";

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

describe("Product service test suite", () => {
  let productService: ProductService;
  let productModel: Product;
  const orderClientMock = {
    createOrder: jest.fn(),
  };
  const productModelMock = {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    build: jest.fn(),
  };

  beforeEach(() => {
    productService = new ProductService(
      orderClientMock as any,
      productModelMock as any
    );
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  test("Should return a list of products", async () => {
    productModelMock.findAll.mockResolvedValueOnce(someProductsMock);
    const result = await productService.getProducts();
    expect(result).toEqual(someProductsMock);
  });

  test("Should return a product by id", async () => {
    const someProductId = 0;
    productModelMock.findByPk.mockResolvedValueOnce(someProductsMock[0]);
    const result = await productService.getProductById(someProductId);
    expect(result).toEqual(someProductsMock[0]);
  });

  test("Should throw an error with a invalid product id", async () => {
    const someProductId = 0;
    productModelMock.findByPk.mockResolvedValueOnce("");
    expect(
      async () => await productService.getProductById(someProductId)
    ).rejects.toThrow(ConflictException);
  });

  test("Should create a new product", async () => {
    const someProduct: ProductDto & { save: () => {} } = {
      name: "someName",
      price: 10,
      category: "someCategory",
      save: jest.fn(),
    };

    productModelMock.build.mockReturnValueOnce(someProduct);

    await productService.createProduct(someProduct);
    expect(productModelMock.build).toBeCalledWith(someProduct);
    expect(someProduct.save).toBeCalledTimes(1);
  });

  test("Should update a product", async () => {
    const someProductId = 1;
    const someProductChanges: ProductDto & { update: () => {} } = {
      name: "newName",
      category: "newCategory",
      price: 10,
      update: jest.fn(),
    };

    productModelMock.findByPk.mockResolvedValueOnce(someProductChanges);

    await productService.updateProduct(someProductId, someProductChanges);
    expect(someProductChanges.update).toBeCalledWith(someProductChanges);
  });

  test("Should create a product if the id doesn't exists", async () => {
    const someProductId = 1;
    const someProductChanges: ProductDto & { save: () => {} } = {
      name: "newName",
      category: "newCategory",
      price: 10,
      save: jest.fn(),
    };

    productModelMock.findByPk.mockResolvedValueOnce(null);

    jest
      .spyOn(productService, "createProduct")
      .mockResolvedValueOnce(someProductChanges as unknown as Product);

    await productService.updateProduct(someProductId, someProductChanges);
    expect(productService.createProduct).toBeCalledWith(someProductChanges);
  });

  test("Should delete a product", async () => {
    const someProductId = 1;
    const productInstance = {
      deleted: false,
      save: jest.fn(),
    };

    productModelMock.findByPk.mockResolvedValueOnce(productInstance);
    await productService.deleteProduct(someProductId);
    expect(productInstance.deleted).toBeTruthy();
    expect(productInstance.save).toBeCalledTimes(1);
  });

  test("Should throw an error at delete when product doesn't exists", async () => {
    const someProductId = 1;
    productModelMock.findByPk.mockResolvedValueOnce(null);
    expect(
      async () => await productService.deleteProduct(someProductId)
    ).rejects.toThrow(ConflictException);
  });

  test("Should throw an error at delete when product has already been deleted", async () => {
    const someProductId = 1;
    const productInstance = {
      deleted: true,
    };
    productModelMock.findByPk.mockResolvedValueOnce(productInstance);
    expect(
      async () => await productService.deleteProduct(someProductId)
    ).rejects.toThrow(ConflictException);
  });

  test("Should restore a deleted product", async () => {
    const someProductId = 1;
    const productInstance = {
      deleted: true,
      save: jest.fn(),
    };

    productModelMock.findByPk.mockResolvedValueOnce(productInstance);

    await productService.restoreProduct(someProductId);
    expect(productInstance.deleted).toBeFalsy();
    expect(productInstance.save).toBeCalledTimes(1);
  });

  test("Should throw an error at restore when product id doesn't exists", async () => {
    const someProductId = 1;

    productModelMock.findByPk.mockResolvedValueOnce(null);
    expect(
      async () => await productService.restoreProduct(someProductId)
    ).rejects.toThrow(ConflictException);
  });

  test("Should throw an error at restore when product has already been restored", async () => {
    const someProductId = 1;
    const productInstance = {
      deleted: true,
      save: jest.fn(),
    };
    productModelMock.findByPk.mockResolvedValueOnce(productInstance);
    expect(
      async () => await productService.restoreProduct(someProductId)
    ).rejects.toThrow(ConflictException);
  });

  test("Should create a new order", async () => {
    const body: BuyProductsDto = {
      products: [
        { id: 1, quantity: 10 },
        { id: 2, quantity: 10 },
      ],
    };

    const productInstance = {
      id: 1,
      name: "Product",
      toJSON: jest.fn().mockReturnValue({
        id: 1,
        name: "Product",
      }),
    };
    const order = {
      data: {
        products: [
          { id: 1, name: "Product 1", quantity: 10 },
          { id: 2, name: "Product 2", quantity: 10 },
        ],
      },
    };

    productModelMock.findByPk.mockResolvedValue(productInstance);
    orderClientMock.createOrder.mockResolvedValueOnce(order);

    await productService.buyProducts(body);

    expect(orderClientMock.createOrder).toBeCalledWith({
      products: [
        { ...productInstance.toJSON(), quantity: 10 },
        { ...productInstance.toJSON(), quantity: 10 },
      ],
    });
  });

  test("Should throw an error if some product doesn't exists", async () => {
    const body: BuyProductsDto = {
      products: [
        { id: 1, quantity: 10 },
        { id: 2, quantity: 10 },
      ],
    };
    productModelMock.findByPk.mockResolvedValueOnce(null);

    expect(async () => await productService.buyProducts(body)).rejects.toThrow(
      ConflictException
    );
  });
});
