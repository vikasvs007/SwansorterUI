import React, { useState, useEffect } from "react";
import {
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Typography,
  Box,
  Avatar,
  ListItemIcon,
  ListItemText,
  Button,
} from "@mui/material";
import {
  NotificationsOutlined,
  PersonAdd,
  Message,
  ChevronRight,
  Circle as CircleIcon,
} from "@mui/icons-material";
import { useTheme } from "@mui/material";
import { useSelector } from "react-redux";
import { useGetUserNotificationsQuery, useMarkNotificationAsReadMutation } from "state/api";

const NotificationBell = () => {
  const theme = useTheme();
  const user = useSelector((state) => state.global.user);
  const [anchorEl, setAnchorEl] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  console.log("Current user:", user); // Debug log

  const { data: notificationsData, isLoading, error } = useGetUserNotificationsQuery(
    user?._id,
    {
      // Only fetch if we have a user ID
      skip: !user?._id,
    }
  );

  console.log("Notifications data:", notificationsData); // Debug log
  console.log("Loading:", isLoading); // Debug log
  console.log("Error:", error); // Debug log

  const [markAsRead] = useMarkNotificationAsReadMutation();

  const notifications = notificationsData?.notifications || [];

  useEffect(() => {
    if (notifications) {
      const count = notifications.filter((n) => !n.is_read).length;
      setUnreadCount(count);
    }
  }, [notifications]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.is_read) {
      try {
        await markAsRead(notification._id).unwrap();
      } catch (err) {
        console.error("Error marking notification as read:", err);
      }
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'new_user':
        return (
          <Avatar sx={{ bgcolor: '#1976d2' }}>
            <PersonAdd />
          </Avatar>
        );
      case 'message':
        return (
          <Avatar sx={{ bgcolor: '#4caf50' }}>
            <Message />
          </Avatar>
        );
      default:
        return (
          <Avatar sx={{ bgcolor: theme.palette.secondary[300] }}>
            <NotificationsOutlined />
          </Avatar>
        );
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const notifDate = new Date(date);
    const diff = Math.floor((now - notifDate) / 1000); // difference in seconds

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  };

  if (!user) {
    console.log("No user found"); // Debug log
    return null;
  }

  return (
    <>
      <IconButton onClick={handleClick}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsOutlined sx={{ color: theme.palette.secondary[100] }} />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            mt: 1.5,
            width: 360,
            maxHeight: 480,
            backgroundColor: theme.palette.background.default,
            boxShadow: theme.shadows[3],
            borderRadius: '8px',
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box p={2} borderBottom={1} borderColor="divider">
          <Typography variant="h6" color={theme.palette.secondary[100]}>
            You have {unreadCount} new notification{unreadCount !== 1 ? 's' : ''}
          </Typography>
        </Box>
        
        {isLoading ? (
          <MenuItem>
            <Typography>Loading notifications...</Typography>
          </MenuItem>
        ) : error ? (
          <MenuItem>
            <Typography color="error">Error loading notifications</Typography>
          </MenuItem>
        ) : notifications.length === 0 ? (
          <MenuItem>
            <Typography>No notifications</Typography>
          </MenuItem>
        ) : (
          notifications.slice(0, 4).map((notification) => (
            <MenuItem
              key={notification._id}
              onClick={() => handleNotificationClick(notification)}
              sx={{
                py: 2,
                px: 2,
                borderBottom: '1px solid',
                borderColor: 'divider',
                '&:hover': {
                  backgroundColor: theme.palette.background.light,
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 48 }}>
                {getNotificationIcon(notification.type)}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="subtitle1" color={theme.palette.secondary[100]}>
                    {notification.message}
                  </Typography>
                }
                secondary={
                  <Typography variant="caption" color={theme.palette.secondary[300]}>
                    {formatTime(notification.created_at)}
                  </Typography>
                }
              />
              {!notification.is_read && (
                <CircleIcon
                  sx={{
                    color: theme.palette.secondary[300],
                    fontSize: 8,
                    ml: 1,
                  }}
                />
              )}
            </MenuItem>
          ))
        )}

        {notifications.length > 0 && (
          <Button
            fullWidth
            onClick={handleClose}
            sx={{
              py: 2,
              color: theme.palette.secondary[100],
              justifyContent: 'space-between',
              '&:hover': {
                backgroundColor: 'transparent',
              },
            }}
            endIcon={<ChevronRight />}
          >
            See all notifications
          </Button>
        )}
      </Menu>
    </>
  );
};

export default NotificationBell;
