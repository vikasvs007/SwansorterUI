import OverallStat from "../models/OverallStat.js";

export const getSales = async (req, res) => {
  try {
    const overallStats = await OverallStat.find();
    
    if (!overallStats || overallStats.length === 0) {
      return res.status(404).json({ message: "No sales data found" });
    }

    // Transform the salesByCategory from Map to regular object if needed
    const formattedStats = {
      ...overallStats[0]._doc,
      salesByCategory: Object.fromEntries(overallStats[0].salesByCategory)
    };

    res.status(200).json(formattedStats);
  } catch (error) {
    console.error("Error fetching sales data:", error);
    res.status(500).json({ message: "Error fetching sales data", error: error.message });
  }
};
