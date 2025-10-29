import { Sequelize } from "sequelize";
import * as dotenv from "dotenv";

// load env variables
dotenv.config();

// create sequelize instance with postgres
export const sequelize = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USER as string,
  process.env.DB_PASS as string,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: "postgres",
    logging: false // disable sql query logging
  }
);
