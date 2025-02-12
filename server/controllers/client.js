import mongoose from "mongoose";
import Product from "../models/Product.js";
import ProductStat from "../models/ProductStat.js";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import Notification from "../models/Notification.js";
import getCountryIso3 from "country-iso-2-to-3";
import { createNotificationForAdmins, createNotificationForUser } from "../utils/notificationHelper.js";

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();

    const productsWithStats = await Promise.all(
      products.map(async (product) => {
        const stat = await ProductStat.find({
          productId: product._id,
        });
        return {
          ...product._doc,
          stat,
        };
      })
    );

    res.status(200).json(productsWithStats);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getCustomers = async (req, res) => {
  try {
    console.log('Fetching customers...');
    const customers = await User.find({ role: "user" }).select("-password");
    console.log(`Found ${customers.length} customers`);
    res.status(200).json(customers);
  } catch (error) {
    console.error('Error in getCustomers:', error);
    res.status(404).json({ message: error.message });
  }
};

export const getTransactions = async (req, res) => {
  try {
    // sort should look like this: { "field": "userId", "sort": "desc"}
    const { page = 1, pageSize = 20, sort = null, search = "" } = req.query;

    // formatted sort should look like { userId: -1 }
    const generateSort = () => {
      const sortParsed = JSON.parse(sort);
      const sortFormatted = {
        [sortParsed.field]: (sortParsed.sort = "asc" ? 1 : -1),
      };

      return sortFormatted;
    };
    const sortFormatted = Boolean(sort) ? generateSort() : {};

    // Get all transactions
    const transactions = await Transaction.find({
      $or: [
        { cost: { $regex: new RegExp(search, "i") } },
      ],
    })
      .sort(sortFormatted)
      .skip(page * pageSize)
      .limit(pageSize)
      .lean();  // Convert to plain JavaScript objects

    // Get all unique userIds
    const userIds = [...new Set(transactions.map(t => t.userId))];
    
    // Find all users that match either ObjectId or string userId
    const users = await User.find({
      $or: [
        { _id: { $in: userIds } },
        { _id: { $in: userIds.filter(id => mongoose.Types.ObjectId.isValid(id)) } }
      ]
    }).lean();

    // Create a map of both string and ObjectId to username
    const userMap = {};
    users.forEach(user => {
      userMap[user._id.toString()] = user.name;
    });

    // Transform transactions to include username
    const transactionsWithUsernames = transactions.map(transaction => ({
      ...transaction,
      username: userMap[transaction.userId.toString()] || 'Unknown User',
      userId: transaction.userId // Keep userId for reference
    }));

    const total = await Transaction.countDocuments({
      $or: [
        { cost: { $regex: new RegExp(search, "i") } },
      ],
    });

    res.status(200).json({
      transactions: transactionsWithUsernames,
      total,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getGeography = async (req, res) => {
  try {
    const users = await User.find();

    const mappedLocations = users.reduce((acc, { country }) => {
      if (!country) return acc; // Skip if country is undefined or null
      try {
        const countryISO3 = getCountryIso3(country);
        if (!acc[countryISO3]) {
          acc[countryISO3] = 0;
        }
        acc[countryISO3]++;
      } catch (err) {
        console.log(`Error converting country code for: ${country}`);
      }
      return acc;
    }, {});

    const formattedLocations = Object.entries(mappedLocations).map(
      ([country, count]) => {
        return { id: country, value: count };
      }
    );

    res.status(200).json(formattedLocations);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const addGeographyData = async (req, res) => {
  try {
    const { country } = req.body;
    if (!country) {
      return res.status(400).json({ message: "Country code is required" });
    }

    // Create a new user with the given country
    const newUser = new User({
      name: `User_${Date.now()}`,
      email: `user_${Date.now()}@example.com`,
      password: "password123",
      country: country,
      role: "user"
    });

    await newUser.save();
    
    // Return updated geography data
    const users = await User.find();
    const mappedLocations = users.reduce((acc, { country }) => {
      const countryISO3 = getCountryIso3(country);
      if (!acc[countryISO3]) {
        acc[countryISO3] = 0;
      }
      acc[countryISO3]++;
      return acc;
    }, {});

    const formattedLocations = Object.entries(mappedLocations).map(
      ([country, count]) => {
        return { id: country, value: count };
      }
    );

    res.status(201).json(formattedLocations);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateGeography = async (req, res) => {
  try {
    const { userId, country } = req.body;
    if (!userId || !country) {
      return res.status(400).json({ message: "User ID and country code are required" });
    }

    // Update user's country
    await User.findByIdAndUpdate(userId, { country });
    
    // Return updated geography data
    const users = await User.find();
    const mappedLocations = users.reduce((acc, { country }) => {
      const countryISO3 = getCountryIso3(country);
      if (!acc[countryISO3]) {
        acc[countryISO3] = 0;
      }
      acc[countryISO3]++;
      return acc;
    }, {});

    const formattedLocations = Object.entries(mappedLocations).map(
      ([country, count]) => {
        return { id: country, value: count };
      }
    );

    res.status(200).json(formattedLocations);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteGeographyData = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Delete the user
    await User.findByIdAndDelete(userId);
    
    // Return updated geography data
    const users = await User.find();
    const mappedLocations = users.reduce((acc, { country }) => {
      const countryISO3 = getCountryIso3(country);
      if (!acc[countryISO3]) {
        acc[countryISO3] = 0;
      }
      acc[countryISO3]++;
      return acc;
    }, {});

    const formattedLocations = Object.entries(mappedLocations).map(
      ([country, count]) => {
        return { id: country, value: count };
      }
    );

    res.status(200).json(formattedLocations);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const createCustomer = async (req, res) => {
  try {
    const newCustomer = new User({
      ...req.body,
      role: "user",
    });

    const savedCustomer = await newCustomer.save();

    // Create notifications for all admin users about the new customer
    await createNotificationForAdmins(
      'new_user',
      `New customer ${savedCustomer.name} has registered`,
      'person_add'
    );

    res.status(201).json(savedCustomer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateCustomer = async (req, res) => {
  try {
    console.log('Updating customer:', req.params.id);
    console.log('Update data:', req.body);
    
    const customerId = req.params.id;
    if (!customerId) {
      return res.status(400).json({ message: "Customer ID is required" });
    }

    const updatedCustomer = await User.findByIdAndUpdate(
      customerId,
      { $set: req.body },
      { new: true }
    );

    if (!updatedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    console.log('Customer updated successfully');
    res.status(200).json(updatedCustomer);
  } catch (error) {
    console.error('Error in updateCustomer:', error);
    res.status(400).json({ message: error.message });
  }
};

export const deleteCustomer = async (req, res) => {
  try {
    console.log('Deleting customer:', req.params.id);
    
    const customerId = req.params.id;
    if (!customerId) {
      return res.status(400).json({ message: "Customer ID is required" });
    }

    const deletedCustomer = await User.findByIdAndDelete(req.params.id);
    
    if (!deletedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    console.log('Customer deleted successfully');
    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error) {
    console.error('Error in deleteCustomer:', error);
    res.status(400).json({ message: error.message });
  }
};

// Products CRUD
export const createProduct = async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();

    // Create notification for admins about new product
    await createNotificationForAdmins(
      'alert',
      `New product ${savedProduct.name} has been added to the catalog`,
      'inventory'
    );

    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Transactions CRUD
export const createTransaction = async (req, res) => {
  try {
    const newTransaction = new Transaction(req.body);
    const savedTransaction = await newTransaction.save();

    // Create notification for admins about new transaction
    await createNotificationForAdmins(
      'new_order',
      `New transaction of $${savedTransaction.cost} has been made`,
      'shopping_cart'
    );

    // Also notify the user who made the transaction
    await createNotificationForUser(
      savedTransaction.userId,
      'new_order',
      `Your transaction of $${savedTransaction.cost} has been confirmed`,
      'check_circle'
    );

    res.status(201).json(savedTransaction);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updateTransaction = async (req, res) => {
  try {
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedTransaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
