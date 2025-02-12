import React, { useState, useEffect } from "react";
import {
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Typography,
  Box,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  NotificationsOutlined,
  PersonAdd,
  Message,
  Warning,
  Circle as CircleIcon,
} from "@mui/icons-material";
import { useTheme } from "@mui/material";
import { useSelector } from "react-redux";
import { useGetUserNotificationsQuery } from "state/api";

const NotificationBell = () => {
  const theme = useTheme();
  const userId = useSelector((state) => state.global.userId);
  const [anchorEl, setAnchorEl] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  console.log("UserId in NotificationBell:", userId); // Debug log

  const { data: notificationsData, isLoading, error } = useGetUserNotificationsQuery(
    userId,
    {
      skip: !userId,
      pollingInterval: 30000, // Poll every 30 seconds
    }
  );

  console.log("Notifications data:", notificationsData); // Debug log

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

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'new_user':
        return <PersonAdd />;
      case 'message':
        return <Message />;
      case 'alert':
        return <Warning />;
      default:
        return <NotificationsOutlined />;
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const notifDate = new Date(date);
    const diff = Math.floor((now - notifDate) / 1000);

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  };

  // If no userId is available, don't render the bell
  if (!userId) {
    console.log("No userId found"); // Debug log
    return null;
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <IconButton 
        onClick={handleClick}
        sx={{ 
          color: theme.palette.secondary[100],
          '&:hover': { 
            backgroundColor: theme.palette.background.light 
          }
        }}
      >
        <Badge 
          badgeContent={unreadCount} 
          color="error"
          sx={{
            '& .MuiBadge-badge': {
              backgroundColor: theme.palette.secondary.main,
              color: '#fff'
            }
          }}
        >
          <NotificationsOutlined sx={{ fontSize: "25px" }} />
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
            backgroundColor: theme.palette.background.alt,
            borderRadius: '8px',
            boxShadow: theme.shadows[3],
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box p={2} borderBottom={1} borderColor="divider">
          <Typography variant="h6" color={theme.palette.secondary[100]}>
            Notifications ({unreadCount} unread)
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
          notifications.map((notification) => (
            <MenuItem
              key={notification._id}
              sx={{
                py: 1.5,
                px: 2,
                borderBottom: '1px solid',
                borderColor: 'divider',
                '&:hover': {
                  backgroundColor: theme.palette.background.light,
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: theme.palette.secondary[300] }}>
                {getNotificationIcon(notification.type)}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography 
                    variant="body1" 
                    color={theme.palette.secondary[100]}
                    sx={{ mb: 0.5 }}
                  >
                    {notification.message}
                  </Typography>
                }
                secondary={
                  <Typography 
                    variant="caption" 
                    color={theme.palette.secondary[300]}
                  >
                    {formatTime(notification.created_at)}
                  </Typography>
                }
              />
              {!notification.is_read && (
                <CircleIcon
                  sx={{
                    color: theme.palette.secondary.main,
                    fontSize: 8,
                    ml: 1,
                  }}
                />
              )}
            </MenuItem>
          ))
        )}
      </Menu>
    </Box>
  );
};

export default NotificationBell;
