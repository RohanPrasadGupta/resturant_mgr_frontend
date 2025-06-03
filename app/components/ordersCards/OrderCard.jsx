"use client";
import React from "react";
import {
  Box,
  Paper,
  Typography,
  Divider,
  Grid,
  Chip,
  Avatar,
  Card,
  CardMedia,
  CardContent,
  List,
  ListItem,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import TableRestaurantIcon from "@mui/icons-material/TableRestaurant";
import PersonIcon from "@mui/icons-material/Person";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PendingIcon from "@mui/icons-material/Pending";
import styles from "./orderStyle.module.scss";

// Helper function to format date
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

const OrderCard = ({ orderData }) => {
  if (!orderData) {
    return (
      <Box className={styles.noOrderContainer}>
        <Typography variant="h6">No order data available</Typography>
      </Box>
    );
  }

  const { tableNumber, items, total, createdAt, orderBy } = orderData;

  return (
    <Box className={styles.container}>
      <Paper elevation={3} className={styles.orderCard}>
        {/* Order Header */}
        <Box className={styles.header}>
          <Box className={styles.headerMain}>
            <Box className={styles.titleSection}>
              <Typography variant="h5" component="h1" className={styles.title}>
                Order Details
              </Typography>
              <Chip
                icon={<TableRestaurantIcon fontSize="small" />}
                label={`Table ${tableNumber}`}
                className={styles.tableChip}
              />
            </Box>
            <Chip
              label="ACTIVE"
              color="warning"
              className={styles.statusChip}
            />
          </Box>

          <Box className={styles.orderMeta}>
            <Box className={styles.metaItem}>
              <AccessTimeIcon className={styles.metaIcon} />
              <Typography variant="body2">{formatDate(createdAt)}</Typography>
            </Box>
            <Box className={styles.metaItem}>
              <PersonIcon className={styles.metaIcon} />
              <Typography variant="body2">
                Ordered by: {orderBy === "staff" ? "Staff" : "Customer"}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider className={styles.divider} />

        {/* Order Items */}
        <Box className={styles.itemsSection}>
          <Typography variant="h6" className={styles.sectionTitle}>
            Items
          </Typography>

          <List className={styles.itemsList}>
            {items.map((item) => (
              <Card key={item._id} className={styles.itemCard}>
                <Grid container spacing={2} className={styles.itemContent}>
                  <Grid
                    item
                    xs={3}
                    sm={2}
                    className={styles.itemImageContainer}
                  >
                    <CardMedia
                      component="img"
                      className={styles.itemImage}
                      image={item.menuItem.image}
                      alt={item.menuItem.name}
                    />
                  </Grid>

                  <Grid item xs={9} sm={10}>
                    <Grid container>
                      <Grid item xs={12} sm={8}>
                        <Box className={styles.itemDetails}>
                          <Typography
                            variant="subtitle1"
                            className={styles.itemName}
                          >
                            {item.menuItem.name}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            className={styles.itemDescription}
                          >
                            {item.menuItem.description}
                          </Typography>
                          <Chip
                            label={item.menuItem.category}
                            size="small"
                            className={styles.categoryChip}
                          />
                          <Box className={styles.servedStatus}>
                            {item.orderServed ? (
                              <Chip
                                icon={
                                  <CheckCircleOutlineIcon fontSize="small" />
                                }
                                label="Served"
                                size="small"
                                color="success"
                                variant="outlined"
                              />
                            ) : (
                              <Chip
                                icon={<PendingIcon fontSize="small" />}
                                label="Preparing"
                                size="small"
                                color="warning"
                                variant="outlined"
                              />
                            )}
                          </Box>
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <Box className={styles.priceSection}>
                          <Box className={styles.quantityPrice}>
                            <Typography variant="body2" color="text.secondary">
                              Price: ₹{item.price}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Qty: {item.quantity}
                            </Typography>
                          </Box>
                          <Typography
                            variant="subtitle1"
                            className={styles.subtotal}
                          >
                            ₹{item.price * item.quantity}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Card>
            ))}
          </List>
        </Box>

        {/* Order Summary */}
        <Box className={styles.summary}>
          <Divider className={styles.divider} />

          <Box className={styles.summaryContent}>
            <Box className={styles.summaryRow}>
              <Typography variant="body1">Items:</Typography>
              <Typography variant="body1">
                {items.reduce((total, item) => total + item.quantity, 0)}
              </Typography>
            </Box>

            <Box className={styles.summaryRow}>
              <Typography variant="body1">Subtotal:</Typography>
              <Typography variant="body1">₹{total}</Typography>
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
    </Box>
  );
};

export default OrderCard;
