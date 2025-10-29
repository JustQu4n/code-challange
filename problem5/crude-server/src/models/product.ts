import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

interface ProductAttributes {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  // optional filename of uploaded image stored in /uploads
  image?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

// for creating products, id is auto-generated
interface ProductCreationAttributes extends Optional<ProductAttributes, "id"> {}

class Product extends Model<ProductAttributes, ProductCreationAttributes> 
  implements ProductAttributes {
  public id!: number;
  public name!: string;
  public description!: string;
  public price!: number;
  public category!: string;
  public stock!: number;
  public image!: string | null;
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0
      }
    }
    ,
    image: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: "products",
    timestamps: true
  }
);

export { Product, ProductAttributes, ProductCreationAttributes };
