import React, { useState } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  Box,
  Chip,
  IconButton,
  Switch,
  FormControlLabel,
  Modal,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import WarningIcon from "@mui/icons-material/Warning";
import styles from "./MenuItemCardStyle.module.scss";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const MenuItemCard = ({ data, reValidateMenuItems }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
    available: true,
  });
  const {
    _id: menuItemId,
    name,
    description,
    price,
    category,
    image,
    available,
  } = data;

  const updateMenuItemMutation = useMutation({
    mutationFn: async ({ menuItemId, updatedData }) => {
      const response = await fetch(
        process.env.NODE_ENV === "development"
          ? `${process.env.LOCAL_BACKEND}/api/menu-items/${menuItemId}`
          : `${process.env.PROD_BACKEDN}/api/menu-items/${menuItemId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(updatedData),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update menu item");
      }
      return response.json();
    },
    onSuccess: () => {
      toast.success(`Menu item "${editFormData.name}" updated successfully!`);
      reValidateMenuItems();
      setIsEditModalOpen(false);
    },
    onError: (error) => {
      toast.error(`Error updating menu item: ${error.message}`);
    },
  });

  const handleEditModal = () => {
    // Pre-fill form with current data
    setEditFormData({
      name,
      description,
      price,
      category,
      image,
      available,
    });
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleUpdateItem = () => {
    if (!menuItemId) {
      toast.error("Unable to update menu item.");
      return;
    }

    // Prepare the data to send to the API
    const updatedData = {
      available: editFormData.available,
      name: editFormData.name,
      description: editFormData.description,
      price: parseInt(editFormData.price),
      category: editFormData.category,
      image: editFormData.image,
    };

    updateMenuItemMutation.mutate({ menuItemId, updatedData });
  };

  const handleFormChange = (field) => (event) => {
    setEditFormData({
      ...editFormData,
      [field]: event.target.value,
    });
  };

  const deleteMenuItemMutation = useMutation({
    mutationFn: async (menuItemId) => {
      const response = await fetch(
        process.env.NODE_ENV === "development"
          ? `${process.env.LOCAL_BACKEND}/api/menu-items/${menuItemId}`
          : `${process.env.PROD_BACKEDN}/api/menu-items/${menuItemId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete menu item");
      }
      return response.json();
    },
    onSuccess: () => {
      toast.success(`Menu item "${name}" deleted successfully!`);
      reValidateMenuItems();
      setIsDeleteDialogOpen(false);
    },
    onError: (error) => {
      toast.error(`Error deleting menu item: ${error.message}`);
    },
  });

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!menuItemId) {
      toast.error("Unable to delete menu item.");
      return;
    }
    deleteMenuItemMutation.mutate(menuItemId);
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
  };

  const toggleStatusMutation = useMutation({
    mutationFn: async (menuItemId) => {
      const response = await fetch(
        process.env.NODE_ENV === "development"
          ? `${process.env.LOCAL_BACKEND}/api/menu-items/${menuItemId}/toggle-availability`
          : `${process.env.PROD_BACKEDN}/api/menu-items/${menuItemId}/toggle-availability`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to toggle availability");
      }
      return response.json();
    },
    onSuccess: () => {
      toast.success(
        `Menu item status updated! ${available ? "Unavailable" : "Available"} `
      );
      reValidateMenuItems();
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const handleAvailabilityToggle = (event) => {
    if (!menuItemId) {
      toast.error("Unable to toggle availability.");
      return;
    }
    toggleStatusMutation.mutate(menuItemId);
  };

  return (
    <Card className={styles.menuItemCard} elevation={3}>
      <Box className={styles.cardHeader}>
        <Chip
          label={category}
          size="small"
          className={`${styles.categoryChip} ${
            category === "vegetarian" ? styles.vegetarian : styles.nonVegetarian
          }`}
        />
        <Chip
          label={available ? "Available" : "Unavailable"}
          size="small"
          className={`${styles.statusChip} ${
            available ? styles.available : styles.unavailable
          }`}
        />
      </Box>

      <CardMedia
        component="img"
        image={image}
        alt={name}
        className={styles.cardMedia}
      />

      <CardContent className={styles.cardContent}>
        <Typography
          gutterBottom
          variant="h6"
          component="div"
          className={styles.itemName}
        >
          {name}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          className={styles.description}
        >
          {description}
        </Typography>

        <Box className={styles.priceSection}>
          <Typography variant="h6" className={styles.price}>
            ₹{price}
          </Typography>
        </Box>

        <Box className={styles.availabilitySection}>
          <FormControlLabel
            control={
              <Switch
                checked={available}
                onChange={handleAvailabilityToggle}
                sx={{
                  "& .MuiSwitch-switchBase.Mui-checked": {
                    color: "#ff9800",
                    "&:hover": {
                      backgroundColor: "rgba(255, 152, 0, 0.08)",
                    },
                  },
                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                    background: "linear-gradient(90deg, #ff5722, #ff9800)",
                  },
                  "& .MuiSwitch-track": {
                    backgroundColor: "#e0e0e0",
                  },
                }}
              />
            }
            label={available ? "Available" : "Unavailable"}
            className={styles.availabilitySwitch}
          />
        </Box>
      </CardContent>

      <CardActions className={styles.cardActions}>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={handleEditModal}
          className={styles.editButton}
          size="small"
          disableElevation
        >
          Edit
        </Button>

        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={handleDeleteClick}
          className={styles.deleteButton}
          size="small"
        >
          Delete
        </Button>
      </CardActions>

      {/* Edit Modal */}
      <Modal
        open={isEditModalOpen}
        onClose={handleCloseEditModal}
        className={styles.modal}
      >
        <Box className={styles.modalContent}>
          <Box className={styles.modalHeader}>
            <Typography variant="h5" className={styles.modalTitle}>
              Edit Menu Item
            </Typography>
            <IconButton
              onClick={handleCloseEditModal}
              className={styles.closeButton}
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <Box className={styles.modalBody}>
            <TextField
              fullWidth
              label="Item Name"
              value={editFormData.name}
              onChange={handleFormChange("name")}
              margin="normal"
              variant="outlined"
              className={styles.formField}
            />

            <TextField
              fullWidth
              label="Description"
              value={editFormData.description}
              onChange={handleFormChange("description")}
              margin="normal"
              variant="outlined"
              multiline
              rows={3}
              className={styles.formField}
            />

            <TextField
              fullWidth
              label="Price (₹)"
              type="number"
              value={editFormData.price}
              onChange={handleFormChange("price")}
              margin="normal"
              variant="outlined"
              className={styles.formField}
            />

            <FormControl fullWidth margin="normal" className={styles.formField}>
              <InputLabel>Category</InputLabel>
              <Select
                value={editFormData.category}
                label="Category"
                onChange={handleFormChange("category")}
              >
                <MenuItem value="vegetarian">Vegetarian</MenuItem>
                <MenuItem value="non-vegetarian">Non-Vegetarian</MenuItem>
                <MenuItem value="vegan">Vegan</MenuItem>
                <MenuItem value="dessert">Dessert</MenuItem>
                <MenuItem value="beverage">Beverage</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Image URL"
              value={editFormData.image}
              onChange={handleFormChange("image")}
              margin="normal"
              variant="outlined"
              className={styles.formField}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={editFormData.available}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      available: e.target.checked,
                    })
                  }
                  sx={{
                    "& .MuiSwitch-switchBase.Mui-checked": {
                      color: "#ff9800",
                    },
                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                      background: "linear-gradient(90deg, #ff5722, #ff9800)",
                    },
                  }}
                />
              }
              label="Available"
              className={styles.modalSwitch}
            />
          </Box>

          <Box className={styles.modalFooter}>
            <Button
              onClick={handleCloseEditModal}
              variant="outlined"
              className={styles.cancelButton}
              disabled={updateMenuItemMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateItem}
              variant="contained"
              startIcon={<SaveIcon />}
              className={styles.saveButton}
              disabled={updateMenuItemMutation.isPending}
              disableElevation
            >
              {updateMenuItemMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onClose={handleDeleteCancel}
        className={styles.deleteDialog}
      >
        <DialogTitle className={styles.deleteDialogTitle}>
          <WarningIcon className={styles.warningIcon} />
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <DialogContentText className={styles.deleteDialogContent}>
            Are you sure you want to delete <strong>"{name}"</strong>? This
            action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions className={styles.deleteDialogActions}>
          <Button
            onClick={handleDeleteCancel}
            variant="outlined"
            className={styles.cancelDeleteButton}
            disabled={deleteMenuItemMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            startIcon={<DeleteIcon />}
            className={styles.confirmDeleteButton}
            disabled={deleteMenuItemMutation.isPending}
          >
            {deleteMenuItemMutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default MenuItemCard;
