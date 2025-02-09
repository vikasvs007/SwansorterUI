import express from "express";
import {
  getProducts,
  getCustomers,
  getTransactions,
  getGeography,
  createCustomer,
  createProduct,
  updateProduct,
  deleteProduct,
  updateCustomer,
  deleteCustomer,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  addGeographyData,
  updateGeography,
  deleteGeographyData,
} from "../controllers/client.js";

const router = express.Router();

// Debug middleware
router.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Products routes
router.get("/products", getProducts);
router.post("/products", createProduct);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

// Customers routes
router.get("/customers", getCustomers);
router.post("/customers", createCustomer);
router.put("/customers/:id", updateCustomer);
router.delete("/customers/:id", deleteCustomer);

// Transactions routes
router.get("/transactions", getTransactions);
router.post("/transactions", createTransaction);
router.put("/transactions/:id", updateTransaction);
router.delete("/transactions/:id", deleteTransaction);

// Geography routes
router.get("/geography", getGeography);
router.post("/geography", addGeographyData);
router.put("/geography", updateGeography);
router.delete("/geography/:userId", deleteGeographyData);

export default router;
