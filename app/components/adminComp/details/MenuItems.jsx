import React, { useEffect, useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import LoaderComp from "../../LoaderComp/LoadingComp";
import {
  Box,
  Typography,
  Container,
  Grid,
  Paper,
  Alert,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  InputAdornment,
  Chip,
  Modal,
  Switch,
  FormControlLabel,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import FilterListIcon from "@mui/icons-material/FilterList";
import ClearIcon from "@mui/icons-material/Clear";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import MenuItemCard from "./menuItem/MenuItemCard";
import styles from "./MenuItemsStyle.module.scss";
import toast from "react-hot-toast";

const MenuItems = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addFormData, setAddFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
    available: true,
  });

  const categories = [
    "vegetarian",
    "non-vegetarian",
    "drinks",
    "soft-drinks",
    "snacks",
  ];

  const {
    isLoading,
    data: allMenuItems,
    error,
  } = useQuery({
    queryKey: ["getAllMenuItems"],
    queryFn: () =>
      fetch(
        process.env.NODE_ENV === "development"
          ? `${process.env.LOCAL_BACKEND}/api/menu-items`
          : `${process.env.PROD_BACKEDN}/api/menu-items`
      ).then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch menu items");
        }
        return res.json();
      }),
  });

  const reValidateMenuItems = () => {
    queryClient.invalidateQueries(["getAllMenuItems"]);
  };

  // Add new menu item mutation
  const addMenuItemMutation = useMutation({
    mutationFn: async (newMenuItemData) => {
      const response = await fetch(
        process.env.NODE_ENV === "development"
          ? `${process.env.LOCAL_BACKEND}/api/menu-items`
          : `${process.env.PROD_BACKEDN}/api/menu-items`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(newMenuItemData),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to create menu item");
      }
      return response.json();
    },
    onSuccess: () => {
      toast.success(`Menu item "${addFormData.name}" created successfully!`);
      reValidateMenuItems();
      setIsAddModalOpen(false);
      // Reset form
      setAddFormData({
        name: "",
        description: "",
        price: "",
        category: "",
        image: "",
        available: true,
      });
    },
    onError: (error) => {
      toast.error(`Error creating menu item: ${error.message}`);
    },
  });

  // Filter the menu items based on search and filters
  const filteredMenuItems = useMemo(() => {
    if (!allMenuItems) return [];

    return allMenuItems.filter((item) => {
      // Search filter
      const matchesSearch = item.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      // Category filter
      const matchesCategory =
        categoryFilter === "" || item.category === categoryFilter;

      // Availability filter
      const matchesAvailability =
        availabilityFilter === "" ||
        item.available.toString() === availabilityFilter;

      return matchesSearch && matchesCategory && matchesAvailability;
    });
  }, [allMenuItems, searchTerm, categoryFilter, availabilityFilter]);

  const handleAddNewMenu = () => {
    setIsAddModalOpen(true);
  };

  const handleAddFormChange = (field, value) => {
    setAddFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddFormSubmit = () => {
    // Basic validation
    if (!addFormData.name?.trim()) {
      toast.error("Menu item name is required");
      return;
    }

    if (!addFormData.price || parseFloat(addFormData.price) <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    if (!addFormData.category) {
      toast.error("Please select a category");
      return;
    }

    const formattedData = {
      ...addFormData,
      name: addFormData.name.trim(),
      description: addFormData.description?.trim() || "",
      price: parseFloat(addFormData.price),
      image: addFormData.image?.trim() || "",
    };

    addMenuItemMutation.mutate(formattedData);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    // Reset form
    setAddFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      image: "",
      available: true,
    });
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("");
    setAvailabilityFilter("");
  };

  if (isLoading) {
    return <LoaderComp />;
  }

  return (
    <Container maxWidth="xl" className={styles.container}>
      {error ? (
        <Alert severity="error" className={styles.errorAlert}>
          Error fetching menu items: {error.message}
        </Alert>
      ) : (
        <Box className={styles.contentSection}>
          <Paper
            className={styles.statsSection}
            elevation={3}
            sx={{
              background: "linear-gradient(90deg, #ff5722 0%, #ff9800 100%)",
              color: "#fff",
              boxShadow: "0 4px 24px 0 rgba(255, 87, 34, 0.08)",
              borderRadius: "18px",
              mb: 4,
              p: { xs: 2, sm: 3 },
            }}
          >
            <Box className={styles.statsHeader}>
              <Typography
                variant="h3"
                className={styles.statsMainTitle}
                sx={{
                  fontWeight: 800,
                  letterSpacing: 1,
                  color: "#fff",
                  fontSize: { xs: "2rem", sm: "2.8rem", md: "3.2rem" },
                  mb: 1,
                  lineHeight: 1.1,
                  textShadow: "0 2px 8px rgba(255, 87, 34, 0.18)",
                }}
              >
                Menu Overview
              </Typography>
            </Box>

            <Box
              className={styles.statsGrid}
              sx={{
                display: "flex",
                gap: { xs: 2, sm: 4 },
                justifyContent: "center",
                alignItems: "center",
                flexWrap: "wrap",
                mt: 1,
              }}
            >
              <Box
                className={styles.statCard}
                sx={{
                  background: "rgba(255,255,255,0.08)",
                  borderRadius: "14px",
                  minWidth: 120,
                  px: 3,
                  py: 2,
                  textAlign: "center",
                  boxShadow: "0 2px 8px 0 rgba(255, 152, 0, 0.08)",
                }}
              >
                <Box className={styles.statContent}>
                  <Typography
                    variant="h4"
                    className={styles.statNumber}
                    sx={{
                      fontWeight: 700,
                      color: "#fff",
                      textShadow: "0 2px 8px rgba(255, 87, 34, 0.15)",
                    }}
                  >
                    {allMenuItems?.length || 0}
                  </Typography>
                  <Typography
                    variant="body1"
                    className={styles.statLabel}
                    sx={{ color: "#ffe0b2", fontWeight: 500 }}
                  >
                    Total Items
                  </Typography>
                </Box>
              </Box>

              <Box
                className={styles.statCard}
                sx={{
                  background: "rgba(255,255,255,0.08)",
                  borderRadius: "14px",
                  minWidth: 120,
                  px: 3,
                  py: 2,
                  textAlign: "center",
                  boxShadow: "0 2px 8px 0 rgba(76, 175, 80, 0.08)",
                }}
              >
                <Box className={styles.statContent}>
                  <Typography
                    variant="h4"
                    className={styles.statNumber}
                    sx={{
                      fontWeight: 700,
                      color: "#fffde7",
                      textShadow: "0 2px 8px rgba(76, 175, 80, 0.12)",
                    }}
                  >
                    {allMenuItems?.filter((item) => item.available).length || 0}
                  </Typography>
                  <Typography
                    variant="body1"
                    className={styles.statLabel}
                    sx={{ color: "#c8e6c9", fontWeight: 500 }}
                  >
                    Available
                  </Typography>
                </Box>
              </Box>

              <Box
                className={styles.statCard}
                sx={{
                  background: "rgba(255,255,255,0.08)",
                  borderRadius: "14px",
                  minWidth: 120,
                  px: 3,
                  py: 2,
                  textAlign: "center",
                  boxShadow: "0 2px 8px 0 rgba(244, 67, 54, 0.08)",
                }}
              >
                <Box className={styles.statContent}>
                  <Typography
                    variant="h4"
                    className={styles.statNumber}
                    sx={{
                      fontWeight: 700,
                      color: "#fff",
                      textShadow: "0 2px 8px rgba(244, 67, 54, 0.12)",
                    }}
                  >
                    {allMenuItems?.filter((item) => !item.available).length ||
                      0}
                  </Typography>
                  <Typography
                    variant="body1"
                    className={styles.statLabel}
                    sx={{ color: "#ffcdd2", fontWeight: 500 }}
                  >
                    Unavailable
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>

          <Paper className={styles.filtersSection} elevation={1}>
            <Box className={styles.filtersHeader}>
              <Box className={styles.filtersTitle}>
                <FilterListIcon className={styles.filterIcon} />
                <Typography variant="h6">Filters & Search</Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setIsAddModalOpen(true)}
                className={styles.addButton}
              >
                Add New Menu
              </Button>
            </Box>

            <Grid container spacing={2} className={styles.filtersGrid}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Search Menu Items"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  variant="outlined"
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  className={styles.searchField}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={categoryFilter}
                    label="Category"
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className={styles.filterSelect}
                  >
                    <MenuItem value="">All Categories</MenuItem>
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() +
                          category.slice(1).replace("-", " ")}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Availability</InputLabel>
                  <Select
                    value={availabilityFilter}
                    label="Availability"
                    onChange={(e) => setAvailabilityFilter(e.target.value)}
                    className={styles.filterSelect}
                  >
                    <MenuItem value="">All Items</MenuItem>
                    <MenuItem value="true">Available</MenuItem>
                    <MenuItem value="false">Unavailable</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={2}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<ClearIcon />}
                  onClick={handleClearFilters}
                  className={styles.clearButton}
                  disabled={
                    !searchTerm && !categoryFilter && !availabilityFilter
                  }
                >
                  Clear
                </Button>
              </Grid>
            </Grid>

            {(searchTerm || categoryFilter || availabilityFilter) && (
              <Box className={styles.activeFilters}>
                <Typography
                  variant="body2"
                  className={styles.activeFiltersLabel}
                >
                  Active Filters:
                </Typography>
                <Box className={styles.activeFiltersChips}>
                  {searchTerm && (
                    <Chip
                      label={`Search: "${searchTerm}"`}
                      onDelete={() => setSearchTerm("")}
                      size="small"
                      className={styles.activeFilterChip}
                    />
                  )}
                  {categoryFilter && (
                    <Chip
                      label={`Category: ${
                        categoryFilter.charAt(0).toUpperCase() +
                        categoryFilter.slice(1).replace("-", " ")
                      }`}
                      onDelete={() => setCategoryFilter("")}
                      size="small"
                      className={styles.activeFilterChip}
                    />
                  )}
                  {availabilityFilter && (
                    <Chip
                      label={`Status: ${
                        availabilityFilter === "true"
                          ? "Available"
                          : "Unavailable"
                      }`}
                      onDelete={() => setAvailabilityFilter("")}
                      size="small"
                      className={styles.activeFilterChip}
                    />
                  )}
                </Box>
              </Box>
            )}
          </Paper>

          <Box className={styles.resultsInfo}>
            <Typography variant="body1" className={styles.resultsText}>
              Showing {filteredMenuItems?.length || 0} of{" "}
              {allMenuItems?.length || 0} menu items
            </Typography>
          </Box>

          <Grid container spacing={3} className={styles.menuGrid}>
            {filteredMenuItems?.map((item) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={item._id}>
                <MenuItemCard
                  data={item}
                  reValidateMenuItems={reValidateMenuItems}
                />
              </Grid>
            ))}
          </Grid>

          {filteredMenuItems?.length === 0 && allMenuItems?.length > 0 && (
            <Paper className={styles.emptyState} elevation={1}>
              <Typography variant="h6" className={styles.emptyTitle}>
                No Menu Items Found
              </Typography>
              <Typography variant="body2" className={styles.emptySubtitle}>
                Try adjusting your search criteria or clear the filters.
              </Typography>
              <Button
                onClick={handleClearFilters}
                variant="outlined"
                className={styles.clearFiltersButton}
                startIcon={<ClearIcon />}
              >
                Clear All Filters
              </Button>
            </Paper>
          )}

          {allMenuItems?.length === 0 && (
            <Paper className={styles.emptyState} elevation={1}>
              <Typography variant="h6" className={styles.emptyTitle}>
                No Menu Items Found
              </Typography>
              <Typography variant="body2" className={styles.emptySubtitle}>
                Start by adding your first menu item to get started.
              </Typography>
              <Button
                onClick={() => setIsAddModalOpen(true)}
                variant="contained"
                className={styles.addFirstItemButton}
                startIcon={<AddIcon />}
              >
                Add First Menu Item
              </Button>
            </Paper>
          )}
        </Box>
      )}

      <Modal
        open={isAddModalOpen}
        onClose={handleCloseAddModal}
        aria-labelledby="add-menu-modal-title"
        aria-describedby="add-menu-modal-description"
      >
        <Box className={styles.modalBox}>
          <Box className={styles.modalHeader}>
            <Typography variant="h6" className={styles.modalTitle}>
              Add New Menu Item
            </Typography>
            <IconButton
              onClick={handleCloseAddModal}
              className={styles.closeButton}
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <Box className={styles.modalContent}>
            <Box className={styles.formContainer}>
              <Box className={styles.fieldGroup}>
                <TextField
                  fullWidth
                  label="Menu Item Name *"
                  value={addFormData.name}
                  onChange={(e) => handleAddFormChange("name", e.target.value)}
                  variant="outlined"
                  className={styles.modalField}
                  placeholder="Enter menu item name..."
                />
              </Box>

              <Box className={styles.fieldGroup}>
                <FormControl fullWidth>
                  <InputLabel>Category *</InputLabel>
                  <Select
                    value={addFormData.category}
                    label="Category *"
                    onChange={(e) =>
                      handleAddFormChange("category", e.target.value)
                    }
                    className={styles.modalField}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() +
                          category.slice(1).replace("-", " ")}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Box className={styles.fieldGroup}>
                <TextField
                  fullWidth
                  label="Price *"
                  type="number"
                  value={addFormData.price}
                  onChange={(e) => handleAddFormChange("price", e.target.value)}
                  variant="outlined"
                  className={styles.modalField}
                  placeholder="0.00"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">₨</InputAdornment>
                    ),
                  }}
                />
              </Box>

              <Box className={styles.fieldGroup}>
                <TextField
                  fullWidth
                  label="Image URL (Optional)"
                  value={addFormData.image}
                  onChange={(e) => handleAddFormChange("image", e.target.value)}
                  variant="outlined"
                  className={styles.modalField}
                  placeholder="https://example.com/image.jpg"
                />
              </Box>

              <Box className={styles.fieldGroup}>
                <TextField
                  fullWidth
                  label="Description (Optional)"
                  value={addFormData.description}
                  onChange={(e) =>
                    handleAddFormChange("description", e.target.value)
                  }
                  variant="outlined"
                  multiline
                  rows={3}
                  className={styles.modalField}
                  placeholder="Brief description of the menu item..."
                />
              </Box>

              <Box className={styles.fieldGroup}>
                <Box className={styles.availabilityContainer}>
                  <Typography
                    variant="body1"
                    className={styles.availabilityTitle}
                  >
                    Availability Status
                  </Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={addFormData.available}
                        onChange={(e) =>
                          handleAddFormChange("available", e.target.checked)
                        }
                        className={styles.availabilitySwitch}
                      />
                    }
                    label={
                      <Typography
                        variant="body2"
                        className={styles.availabilityText}
                      >
                        {addFormData.available
                          ? "Available for ordering"
                          : "Currently unavailable"}
                      </Typography>
                    }
                    className={styles.availabilityLabel}
                  />
                </Box>
              </Box>
            </Box>
          </Box>

          <Box className={styles.modalActions}>
            <Button
              onClick={handleCloseAddModal}
              variant="outlined"
              className={styles.cancelButton}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddFormSubmit}
              variant="contained"
              startIcon={<SaveIcon />}
              disabled={addMenuItemMutation.isLoading}
              className={styles.saveButton}
            >
              {addMenuItemMutation.isLoading
                ? "Creating..."
                : "Create Menu Item"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Container>
  );
};

export default MenuItems;
