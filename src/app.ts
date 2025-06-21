import express from "express";
import navigatioPlanRoutes from './routes/navigationPlanRoutes';
import userRoutes from './routes/userRoutes';
import restrictedAreaRoutes from './routes/restrictedAreaRoutes';
import authRoutes from './routes/authRoutes';
import dotenv from "dotenv";
import errorHandler from "./middlewares/errorHandler";
import { ErrorFactory } from "./factory/error/error_factory";
import { ErrEnum } from "./factory/error/error_enum";

// Create an Express application
const app = express();
// Load environment variables from .env file
dotenv.config();
app.use(express.json());
app.use("/api", navigatioPlanRoutes);
app.use("/api", userRoutes);
app.use("/api", restrictedAreaRoutes);
app.use("/api", authRoutes);

app.use(/.*/, (req, res, next) => {
  const errorFactory = new ErrorFactory();
  const err = errorFactory.getError(ErrEnum.RouteNotFound);
  next(err);
});

app.use(errorHandler)
export default app;