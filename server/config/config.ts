import dotenv from "dotenv";

dotenv.config();

interface Config {
  port: number;
  mongoUrl: string;
  JWT_SECRET: string;
}

const config: Config = {
  port: Number(process.env.PORT) || 3000,
  mongoUrl: process.env.MONGO_URL || "",
  JWT_SECRET: process.env.JWT_SECRET || "",
};

export default config;
