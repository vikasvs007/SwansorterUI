import mongoose from "mongoose";

// Function to create mock notifications data
export const mockNotifications = (adminIds) => {
  const notifications = [];
  const types = ['new_user', 'new_order', 'message', 'alert'];
  const messages = [
    'New customer John Doe has registered',
    'New transaction of $500 has been made',
    'System maintenance scheduled for tonight',
    'You have 5 new orders pending',
    'New product "Gaming Laptop" has been added',
    'Monthly sales report is ready',
    'Server performance alert: High CPU usage',
    'Customer feedback received: 5 star rating',
    'Inventory running low on popular items',
    'New feature release: Advanced Analytics'
  ];

  // Create 20 mock notifications for each admin
  adminIds.forEach(adminId => {
    for (let i = 0; i < 20; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      const message = messages[Math.floor(Math.random() * messages.length)];
      const created_at = new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)); // Random date within last 7 days

      notifications.push({
        user_id: adminId,
        type,
        message,
        is_read: Math.random() > 0.7, // 30% chance of being unread
        is_deleted: false,
        created_at,
        updated_at: created_at
      });
    }
  });

  return notifications;
};
