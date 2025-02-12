import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Avatar,
  IconButton,
  useTheme,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import { Edit as EditIcon, Save as SaveIcon, PhotoCamera } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { useUpdateUserMutation, useUploadPhotoMutation } from 'state/api';
import FlexBetween from './FlexBetween';

const ProfileSettings = () => {
  const theme = useTheme();
  const user = useSelector((state) => state.global.user);
  const [updateUser] = useUpdateUserMutation();
  const [uploadPhoto] = useUploadPhotoMutation();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    city: user?.city || '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('photo', file);

    try {
      setLoading(true);
      await uploadPhoto({ userId: user._id, photo: formData }).unwrap();
      setSnackbar({
        open: true,
        message: 'Profile photo updated successfully!',
        severity: 'success',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to update profile photo',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await updateUser({ userId: user._id, ...formData }).unwrap();
      setIsEditing(false);
      setSnackbar({
        open: true,
        message: 'Profile updated successfully!',
        severity: 'success',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to update profile',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box m="1.5rem 2.5rem">
      <FlexBetween>
        <Typography variant="h4" color={theme.palette.secondary[100]}>
          Profile Settings
        </Typography>
        <Button
          onClick={() => setIsEditing(!isEditing)}
          startIcon={isEditing ? <SaveIcon /> : <EditIcon />}
          variant="contained"
          color={isEditing ? "primary" : "secondary"}
        >
          {isEditing ? "Save" : "Edit Profile"}
        </Button>
      </FlexBetween>

      <Card
        sx={{
          mt: "1rem",
          backgroundColor: theme.palette.background.alt,
          borderRadius: "0.55rem",
        }}
      >
        <CardContent>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mb="2rem"
          >
            <Avatar
              src={user?.photo}
              sx={{
                width: 120,
                height: 120,
                mb: 2,
                border: `2px solid ${theme.palette.secondary[100]}`,
              }}
            />
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="photo-upload"
              type="file"
              onChange={handlePhotoUpload}
            />
            <label htmlFor="photo-upload">
              <IconButton
                color="primary"
                component="span"
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} />
                ) : (
                  <PhotoCamera />
                )}
              </IconButton>
            </label>
          </Box>

          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="1rem"
              gridTemplateColumns="repeat(2, 1fr)"
            >
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={!isEditing}
                variant="filled"
                sx={{ gridColumn: "span 1" }}
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                variant="filled"
                sx={{ gridColumn: "span 1" }}
              />
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
                variant="filled"
                sx={{ gridColumn: "span 1" }}
              />
              <TextField
                fullWidth
                label="City"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                disabled={!isEditing}
                variant="filled"
                sx={{ gridColumn: "span 1" }}
              />
            </Box>
          </form>
        </CardContent>
      </Card>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProfileSettings;
