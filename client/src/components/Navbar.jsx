import React, { useState } from "react";
import {
  LightModeOutlined,
  DarkModeOutlined,
  Menu as MenuIcon,
  Search,
  ArrowDropDownOutlined,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import FlexBetween from "components/FlexBetween";
import { useDispatch } from "react-redux";
import { setMode } from "state";
import {
  AppBar,
  Button,
  Box,
  Typography,
  IconButton,
  InputBase,
  Toolbar,
  Menu,
  MenuItem,
  useTheme,
  Avatar,
  Divider,
  ListItemIcon,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import NotificationBell from "components/NotificationBell"; // Make sure this path is correct
import profileImage from "assets/profile.jpeg";

const Navbar = ({ user, isSidebarOpen, setIsSidebarOpen }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const isOpen = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleProfileClick = () => {
    handleClose();
    navigate("/profile");
  };

  const handleAccountClick = () => {
    handleClose();
    navigate("/account-settings");
  };

  const handleLogout = () => {
    handleClose();
    // Add logout logic here
  };

  return (
    <AppBar
      sx={{
        position: "static",
        background: "none",
        boxShadow: "none",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* LEFT SIDE */}
        <FlexBetween>
          <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <MenuIcon />
          </IconButton>
          <FlexBetween
            backgroundColor={theme.palette.background.alt}
            borderRadius="9px"
            gap="3rem"
            p="0.1rem 1.5rem"
          >
            <InputBase placeholder="Search..." />
            <IconButton>
              <Search />
            </IconButton>
          </FlexBetween>
        </FlexBetween>

        {/* RIGHT SIDE */}
        <FlexBetween gap="1.5rem">
          <IconButton onClick={() => dispatch(setMode())}>
            {theme.palette.mode === "dark" ? (
              <DarkModeOutlined sx={{ fontSize: "25px" }} />
            ) : (
              <LightModeOutlined sx={{ fontSize: "25px" }} />
            )}
          </IconButton>
          {user && user._id && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <NotificationBell />
            </Box>
          )}
          <Box>
            <Button
              onClick={handleClick}
              sx={{
                display: "flex",
                alignItems: "center",
                textTransform: "none",
                gap: "1rem",
              }}
            >
              <Avatar
                src={user?.photo || profileImage}
                sx={{ width: 32, height: 32 }}
              />
              <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                <Typography
                  variant="subtitle2"
                  component="span"
                  sx={{ color: theme.palette.secondary[100] }}
                >
                  Hi, {user?.name?.split(' ')[0] || 'SwanSorter'}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: theme.palette.secondary[200] }}
                >
                  {user?.email || 'SwanSorter@swansorter.com'}
                </Typography>
              </Box>
              <ArrowDropDownOutlined
                sx={{ color: theme.palette.secondary[300], fontSize: "25px" }}
              />
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={isOpen}
              onClose={handleClose}
              onClick={handleClose}
              PaperProps={{
                sx: {
                  mt: 1,
                  minWidth: 220,
                  backgroundColor: theme.palette.background.alt,
                }
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <Box sx={{ px: 2, py: 1.5 }}>
                <FlexBetween>
                  <Avatar
                    src={user?.photo || profileImage}
                    sx={{ width: 40, height: 40 }}
                  />
                  <Box sx={{ ml: 2 }}>
                    <Typography variant="subtitle2" sx={{ color: theme.palette.secondary[100] }}>
                      {user?.name || 'SwanSorter'}
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme.palette.secondary[200] }}>
                      {user?.email || 'SwanSorter@swansorter.com'}
                    </Typography>
                  </Box>
                </FlexBetween>
              </Box>
              <Divider sx={{ my: 1 }} />
              <MenuItem onClick={handleProfileClick}>
                <ListItemIcon>
                  <PersonIcon fontSize="small" />
                </ListItemIcon>
                My Profile
              </MenuItem>
              <MenuItem onClick={handleAccountClick}>
                <ListItemIcon>
                  <SettingsIcon fontSize="small" />
                </ListItemIcon>
                Account Setting
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </FlexBetween>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
