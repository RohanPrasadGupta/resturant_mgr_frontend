"use client";
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import LoaderComp from "@/app/components/LoaderComp/LoadingComp";
import ItemCard from "@/app/components/itemCard/ItemCard";
import {
  Box,
  Container,
  Typography,
  Grid,
  Tabs,
  Tab,
  InputAdornment,
  TextField,
  Fade,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import styles from "./homepageStyle.module.scss";

const Homepage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isFiltering, setIsFiltering] = useState(false);
  const [visibleItems, setVisibleItems] = useState([]);

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["menuItems"],
    queryFn: fetchTodoList,
  });

  function fetchTodoList() {
    return fetch(
      "https://resturant-mgr-backend.onrender.com/api/menu-items"
    ).then((res) => res.json());
  }

  // Get unique categories from data
  const getCategories = () => {
    if (!data) return [];
    const categories = data.map((item) => item.category);
    return ["all", ...new Set(categories)];
  };

  // Filter items based on category and search term
  const getFilteredItems = () => {
    if (!data) return [];
    return data.filter((item) => {
      const matchesCategory =
        activeCategory === "all" || item.category === activeCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  };

  const handleCategoryChange = (event, newValue) => {
    setIsFiltering(true);
    setActiveCategory(newValue);
  };

  const handleSearchChange = (event) => {
    setIsFiltering(true);
    setSearchTerm(event.target.value);
  };

  // Apply animation when data changes
  useEffect(() => {
    const filteredItems = getFilteredItems();

    if (isFiltering) {
      // Show loading state for a short time
      const timer = setTimeout(() => {
        setIsFiltering(false);
        // Set all items at once when filtering is done
        setVisibleItems(filteredItems);
      }, 600);

      return () => clearTimeout(timer);
    } else if (!isFiltering && data) {
      // Initial data load
      setVisibleItems(filteredItems);
    }
  }, [data, isFiltering, activeCategory, searchTerm]);

  if (isPending) return <LoaderComp />;
  if (isError)
    return (
      <Container className={styles.errorContainer}>
        <Typography variant="h5" color="error">
          Error loading menu items
        </Typography>
        <Typography>{error.message}</Typography>
      </Container>
    );

  const gridColumns = isMobile ? 1 : isTablet ? 2 : 3;

  return (
    <Container
      className={styles.homepageContainer}
      maxWidth={false}
      disableGutters
    >
      <Box className={styles.headerSection}>
        <Typography variant="h3" className={styles.mainTitle}>
          Our Menu
        </Typography>
        <Typography variant="subtitle1" className={styles.subtitle}>
          Discover our delicious selections prepared with fresh ingredients
        </Typography>
      </Box>

      <Box className={styles.filterSection}>
        <TextField
          placeholder="Search menu..."
          variant="outlined"
          size={isMobile ? "small" : "medium"}
          className={styles.searchField}
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <Tabs
          value={activeCategory}
          onChange={handleCategoryChange}
          className={styles.categoryTabs}
          TabIndicatorProps={{ className: styles.tabIndicator }}
          variant="scrollable"
          scrollButtons={isMobile ? "auto" : "desktop"}
        >
          {getCategories().map((category) => (
            <Tab
              key={category}
              label={category.charAt(0).toUpperCase() + category.slice(1)}
              value={category}
              className={styles.categoryTab}
            />
          ))}
        </Tabs>
      </Box>

      <Box className={styles.menuGridContainer}>
        {isFiltering ? (
          <Box className={styles.loaderContainer}>
            <LoaderComp size="medium" />
          </Box>
        ) : visibleItems && visibleItems.length > 0 ? (
          <Fade in={true} timeout={300}>
            <Grid container spacing={0} className={styles.menuGrid}>
              {visibleItems.map((item) => (
                <Grid key={item._id} className={styles.menuItem}>
                  <ItemCard data={item} />
                </Grid>
              ))}
            </Grid>
          </Fade>
        ) : (
          <Fade in={true} timeout={500}>
            <Box className={styles.noResults}>
              <Typography variant="h6">
                No menu items found matching your criteria
              </Typography>
            </Box>
          </Fade>
        )}
      </Box>
    </Container>
  );
};

export default Homepage;
