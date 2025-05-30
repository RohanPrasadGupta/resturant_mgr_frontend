"use client";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Divider,
  Chip,
  Container,
  List,
  ListItem,
  ListItemText,
  Button,
  Alert,
  useTheme,
  useMediaQuery,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonIcon from "@mui/icons-material/Person";
import TableRestaurantIcon from "@mui/icons-material/TableRestaurant";
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ReceiptIcon from "@mui/icons-material/Receipt";
import PaymentIcon from "@mui/icons-material/Payment";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import styles from "./orderStyle.module.scss";
import LoaderComp from "@/app/components/LoaderComp/LoadingComp";

const formatDate = (dateString) => {
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(dateString).toLocaleDateString("en-US", options);
};

const OrderPage = () => {
  const userData = useSelector((state) => state.selectedUser.value);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const queryClient = useQueryClient();

  // Get table number from Redux or localStorage
  const tableNumber =
    userData.tableNumber ||
    (typeof window !== "undefined" &&
      localStorage.getItem("mgrUserData") &&
      JSON.parse(localStorage.getItem("mgrUserData")).tableNumber);

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["getOrder", tableNumber],
    queryFn: () =>
      fetch(
        `https://resturant-mgr-backend.onrender.com/api/table/${tableNumber}`
      ).then((res) => res.json()),
    enabled: !!tableNumber, // Only run query if tableNumber exists
  });

  // Mutation to update item quantity
  const updateItemQuantity = useMutation({
    mutationFn: async ({ itemId, newQuantity }) => {
      // Replace with your actual API endpoint
      return fetch(
        `https://resturant-mgr-backend.onrender.com/api/order/item/${itemId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ quantity: newQuantity }),
        }
      ).then((res) => res.json());
    },
    onSuccess: () => {
      // Invalidate and refetch the order data
      queryClient.invalidateQueries({ queryKey: ["getOrder", tableNumber] });
    },
  });

  const handleQuantityChange = (itemId, currentQuantity, change) => {
    const newQuantity = Math.max(1, currentQuantity + change);
    updateItemQuantity.mutate({ itemId, newQuantity });
  };

  if (isPending) return <LoaderComp />;

  if (isError) {
    return (
      <Container className={styles.errorContainer}>
        <Alert severity="error">Error loading order: {error.message}</Alert>
      </Container>
    );
  }

  if (!data || !data.currentOrder) {
    return (
      <Container
        className={`${styles.noOrderContainer} ${styles.fullScreenContainer}`}
      >
        <Paper elevation={2} className={styles.noOrderPaper}>
          <ShoppingCartIcon className={styles.noOrderIcon} />
          <Typography variant="h5" className={styles.noOrderTitle}>
            No Active Order
          </Typography>
          <Typography variant="body1" color="textSecondary">
            There is no active order for this table at the moment.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            href="/pages/home"
            className={styles.startOrderButton}
          >
            Start a New Order
          </Button>
        </Paper>
      </Container>
    );
  }

  const { currentOrder } = data;
  const { items, total, createdAt, orderBy } = currentOrder;

  return (
    <Container
      className={`${styles.orderContainer} ${styles.fullScreenContainer}`}
    >
      <Paper elevation={2} className={styles.orderPaper}>
        {/* Order Header with basic info */}
        <Box className={styles.orderHeader}>
          <Box className={styles.headerMain}>
            <Typography
              variant="h5"
              component="h1"
              className={styles.orderTitle}
            >
              Table {data.number} - Order Details
            </Typography>
            <Chip
              label={data.status.toUpperCase()}
              color={data.status === "available" ? "success" : "warning"}
              className={styles.statusChip}
            />
          </Box>

          <Grid container spacing={2} className={styles.orderMetaInfo}>
            <Grid item xs={12} sm={6}>
              <Box className={styles.metaInfoItem}>
                <AccessTimeIcon fontSize="small" />
                <Typography variant="body2">
                  Ordered: {formatDate(createdAt)}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box className={styles.metaInfoItem}>
                <PersonIcon fontSize="small" />
                <Typography variant="body2">
                  By: {orderBy === "staff" ? "Restaurant Staff" : "Customer"}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Divider className={styles.sectionDivider} />

        {/* Order Items List */}
        <Box className={styles.orderItemsSection}>
          <Typography variant="h6" className={styles.sectionTitle}>
            Order Items
          </Typography>

          {isMobile ? (
            // Mobile view - stacked cards
            <List className={styles.mobileItemsList}>
              {items.map((item) => (
                <Paper
                  key={item._id}
                  elevation={1}
                  className={styles.mobileItemCard}
                >
                  <Box className={styles.mobileItemHeader}>
                    <Typography variant="subtitle1" className={styles.itemName}>
                      {item.menuItem.name}
                    </Typography>
                    <Chip
                      label={item.menuItem.category}
                      size="small"
                      color={
                        item.menuItem.category === "vegetarian"
                          ? "success"
                          : "default"
                      }
                      className={styles.categoryChip}
                    />
                  </Box>

                  <Grid
                    container
                    spacing={1}
                    className={styles.mobileItemDetails}
                  >
                    <Grid item xs={6}>
                      <Typography
                        variant="body2"
                        className={styles.detailLabel}
                      >
                        Price:
                      </Typography>
                      <Typography
                        variant="body2"
                        className={styles.detailValue}
                      >
                        ₹{item.price}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        variant="body2"
                        className={styles.detailLabel}
                      >
                        Quantity:
                      </Typography>
                      <Box className={styles.quantityControls}>
                        <IconButton
                          size="small"
                          onClick={() =>
                            handleQuantityChange(item._id, item.quantity, -1)
                          }
                        >
                          <RemoveIcon fontSize="small" />
                        </IconButton>
                        <Typography
                          variant="body2"
                          className={styles.quantityValue}
                        >
                          {item.quantity}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() =>
                            handleQuantityChange(item._id, item.quantity, 1)
                          }
                        >
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography
                        variant="body2"
                        className={styles.subtotalLine}
                      >
                        Subtotal: <strong>₹{item.quantity * item.price}</strong>
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              ))}
            </List>
          ) : (
            // Desktop view - table
            <TableContainer component={Paper} className={styles.tableContainer}>
              <Table className={styles.itemsTable}>
                <TableHead>
                  <TableRow>
                    <TableCell>Item Name</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="center">Quantity</TableCell>
                    <TableCell align="right">Subtotal</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item._id}>
                      <TableCell component="th" scope="row">
                        {item.menuItem.name}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={item.menuItem.category}
                          size="small"
                          color={
                            item.menuItem.category === "vegetarian"
                              ? "success"
                              : "default"
                          }
                          className={styles.tableCategoryChip}
                        />
                      </TableCell>
                      <TableCell align="right">₹{item.price}</TableCell>
                      <TableCell align="center">
                        <Box className={styles.tableQuantityControls}>
                          <IconButton
                            size="small"
                            onClick={() =>
                              handleQuantityChange(item._id, item.quantity, -1)
                            }
                          >
                            <RemoveIcon fontSize="small" />
                          </IconButton>
                          <Typography
                            variant="body2"
                            className={styles.quantityValue}
                          >
                            {item.quantity}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() =>
                              handleQuantityChange(item._id, item.quantity, 1)
                            }
                          >
                            <AddIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                      <TableCell align="right" className={styles.subtotalCell}>
                        ₹{item.quantity * item.price}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>

        <Divider className={styles.sectionDivider} />

        {/* Order Summary */}
        <Box className={styles.orderSummary}>
          <Box className={styles.summaryContent}>
            <Box className={styles.summaryRow}>
              <Typography variant="body1">Total Items:</Typography>
              <Typography variant="body1">
                {items.reduce((total, item) => total + item.quantity, 0)}
              </Typography>
            </Box>

            <Box className={styles.summaryRow}>
              <Typography variant="body1">Subtotal:</Typography>
              <Typography variant="body1">
                ₹
                {items.reduce(
                  (total, item) => total + item.quantity * item.price,
                  0
                )}
              </Typography>
            </Box>

            <Divider className={styles.summaryDivider} />

            <Box className={styles.totalRow}>
              <Typography variant="h6">Total:</Typography>
              <Typography
                variant="h6"
                color="primary"
                className={styles.totalAmount}
              >
                ₹{total}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default OrderPage;
