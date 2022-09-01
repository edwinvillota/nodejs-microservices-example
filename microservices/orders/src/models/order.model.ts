import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import { db } from "../common/persistence/mysql.persistence";
import { OrderProduct } from "./order-product.model";

export class Order extends Model<
  InferAttributes<Order>,
  InferCreationAttributes<Order>
> {
  declare id: CreationOptional<number>;
  declare user: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Order.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    user: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "orders",
    sequelize: db,
  }
);

Order.hasMany(OrderProduct, {
  as: "order_products",
  foreignKey: "order_id",
  onDelete: "cascade",
});

OrderProduct.belongsTo(Order, {
  foreignKey: "order_id",
  as: "product",
});

(async () => {
  await db.sync({ force: true });
})();
