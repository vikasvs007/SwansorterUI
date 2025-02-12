import React from 'react';
import { Box, Button } from '@mui/material';
import { 
  useCreateNotificationMutation,
  useCreateBulkNotificationsMutation,
} from 'state/api';

const NotificationExample = () => {
  const [createNotification] = useCreateNotificationMutation();
  const [createBulkNotifications] = useCreateBulkNotificationsMutation();

  // Example function to create a single notification
  const handleCreateSingleNotification = async () => {
    try {
      await createNotification({
        user_id: "user_id_here", // Replace with actual user ID
        message: "New customer registration",
        type: "new_user",
        icon: "person_add"
      });
      console.log("Notification created successfully");
    } catch (error) {
      console.error("Error creating notification:", error);
    }
  };

  // Example function to create bulk notifications
  const handleCreateBulkNotifications = async () => {
    try {
      await createBulkNotifications({
        userIds: ["user1_id", "user2_id"], // Replace with actual user IDs
        message: "System maintenance scheduled",
        type: "alert",
        icon: "warning"
      });
      console.log("Bulk notifications created successfully");
    } catch (error) {
      console.error("Error creating bulk notifications:", error);
    }
  };

  return (
    <Box>
      <Button 
        variant="contained" 
        onClick={handleCreateSingleNotification}
        sx={{ mr: 2 }}
      >
        Create Single Notification
      </Button>
      <Button 
        variant="contained" 
        onClick={handleCreateBulkNotifications}
      >
        Create Bulk Notifications
      </Button>
    </Box>
  );
};

export default NotificationExample;
