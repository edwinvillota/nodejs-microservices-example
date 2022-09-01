import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import { db } from "../common/persistence/mysql.persistence";

export class OrderProduct extends Model<
  InferAttributes<OrderProduct>,
  InferCreationAttributes<OrderProduct>
> {
  declare id: CreationOptional<number>;
  declare order_id: number;
  declare product_id: number;
  declare quantity: number;
  declare name: string;
  declare category: string;
  declare price: number;
  declare photo?: string;
}

OrderProduct.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    order_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    photo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "order_products",
    sequelize: db,
  }
);

// (async () => {
//   await db.sync({ force: true });
// })();
