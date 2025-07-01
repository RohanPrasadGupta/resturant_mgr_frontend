import React from "react";
import {
  Box,
  Paper,
  Typography,
  Divider,
  Grid,
  Chip,
  Card,
  CardMedia,
  List,
  Button,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import TableRestaurantIcon from "@mui/icons-material/TableRestaurant";
import PersonIcon from "@mui/icons-material/Person";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PendingIcon from "@mui/icons-material/Pending";
import styles from "./orderStyle.module.scss";

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
        {/* Header */}
        <Box className={styles.header}>
          <Box className={styles.headerMain}>
            <Box className={styles.titleSection}>
              <Typography variant="h5" className={styles.title}>
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

        <Divider />

        {/* Items */}
        <Box className={styles.itemsSection}>
          <Typography variant="h6" className={styles.sectionTitle}>
            Items
          </Typography>

          <List className={styles.itemsList}>
            {items.map((item) => (
              <Card key={item._id} className={styles.itemCard}>
                <Box className={styles.itemContentRow}>
                  {/* Left Side: Image + Details */}
                  <Box className={styles.itemLeft}>
                    <CardMedia
                      component="img"
                      image={item.menuItem.image}
                      alt={item.menuItem.name}
                      sx={{
                        width: 64,
                        height: 64,
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                    <Box className={styles.itemDetails}>
                      <Typography
                        variant="subtitle1"
                        className={styles.itemName}
                      >
                        {item.menuItem.name}
                      </Typography>
                      <Typography
                        variant="body2"
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
                            icon={<CheckCircleOutlineIcon fontSize="small" />}
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
                  </Box>

                  {/* Right Side: Quantity + Price */}
                  <Box className={styles.itemRight}>
                    <Typography variant="body2" color="text.secondary">
                      Qty: {item.quantity}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Price: ₹{item.price}
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      className={styles.subtotal}
                    >
                      ₹{item.price * item.quantity}
                    </Typography>
                  </Box>
                </Box>
              </Card>
            ))}
          </List>
        </Box>

        <Divider />

        {/* Summary */}
        <Box className={styles.summary}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: 1,
            }}
          >
            <Typography>Items:</Typography>
            <Typography>
              {items.reduce((total, item) => total + item.quantity, 0)}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Typography>Subtotal:</Typography>
            <Typography>₹{total}</Typography>
          </Box>

          {/* Action Buttons */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
              mt: 2,
            }}
          >
            <Button variant="contained" color="success">
              Served
            </Button>
            <Button variant="outlined" color="primary">
              Checkout
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default OrderCard;
