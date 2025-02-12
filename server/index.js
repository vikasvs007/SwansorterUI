import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import clientRoutes from "./routes/client.js";
import generalRoutes from "./routes/general.js";
import managementRoutes from "./routes/management.js";
import salesRoutes from "./routes/sales.js";
import notificationRoutes from "./routes/notification.js";
import testRoutes from "./routes/test.js";

// data imports
import User from "./models/User.js";
import Product from "./models/Product.js";
import ProductStat from "./models/ProductStat.js";
import Transaction from "./models/Transaction.js";
import OverallStat from "./models/OverallStat.js";
import AffiliateStat from "./models/AffiliateStat.js";
import {
  dataUser,
  dataProduct,
  dataProductStat,
  dataTransaction,
  dataOverallStat,
  dataAffiliateStat,
} from "./data/index.js";

/* CONFIGURATION */
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb" }));
app.use(bodyParser.urlencoded({ extended: false, limit: "30mb" }));
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true
}));

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  console.log('Request Headers:', req.headers);
  console.log('Request Body:', req.body);
  next();
});

// Test route
app.post("/test", (req, res) => {
  res.json({ message: "Test endpoint working" });
});

/* ROUTES */
app.use("/api/client", clientRoutes);
app.use("/api/general", generalRoutes);
app.use("/api/management", managementRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/test", testRoutes);

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 9000;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB Connected'))
  .then(async () => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

    /* ONLY ADD DATA ONE TIME */
    // Check if data already exists before inserting
    const [userCount, overallStatCount] = await Promise.all([
      User.countDocuments(),
      OverallStat.countDocuments()
    ]);

    if (userCount === 0 || overallStatCount === 0) {
      console.log("Inserting sample data...");
      await Promise.all([
        User.deleteMany(),
        OverallStat.deleteMany(),
        Product.deleteMany(),
        ProductStat.deleteMany(),
        Transaction.deleteMany(),
        AffiliateStat.deleteMany()
      ]);

      await Promise.all([
        User.insertMany(dataUser),
        OverallStat.insertMany(dataOverallStat),
        Product.insertMany(dataProduct),
        ProductStat.insertMany(dataProductStat),
        Transaction.insertMany(dataTransaction),
        AffiliateStat.insertMany(dataAffiliateStat)
      ]);
      console.log("Sample data inserted successfully");
    } else {
      console.log("Data already exists, skipping insertion");
    }
  })
  .catch((error) => console.log(`${error} did not connect`));
