import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Divider,
  Chip,
  Card,
  CardMedia,
  List,
  Button,
  IconButton,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  useTheme,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import TableRestaurantIcon from "@mui/icons-material/TableRestaurant";
import PersonIcon from "@mui/icons-material/Person";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PendingIcon from "@mui/icons-material/Pending";
import DeleteIcon from "@mui/icons-material/Delete";
import CancelIcon from "@mui/icons-material/Cancel";
import styles from "./orderStyle.module.scss";
import toast from "react-hot-toast";

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

const OrderCard = ({
  orderData,
  onDeleteItem,
  isDeleting,
  tableOrdersID,
  setOrdersID,
  handleDeleteAllTableOrder,
  handleServedTableOrder,
  handleCheckOutTableOrder,
}) => {
  const theme = useTheme();
  const [paymentType, setPaymentType] = useState("");

  if (!orderData) {
    return (
      <Box className={styles.noOrderContainer}>
        <Typography variant="h6">No order data available</Typography>
      </Box>
    );
  }

  const { tableNumber, items, total, createdAt, orderBy } = orderData;

  const handleDeleteItem = (itemId) => {
    if (!itemId) {
      toast.error("Error deleting item");
    }
    if (onDeleteItem && !isDeleting) {
      setOrdersID(tableOrdersID);
      onDeleteItem(itemId);
    }
  };

  const handleCancelTable = () => {
    if (!orderData?._id) {
      toast.error("Error deleting order");
    }
    handleDeleteAllTableOrder(orderData?._id);
  };
  const handleServedTable = () => {
    if (!orderData?._id) {
      toast.error("Error marking served order");
    }
    handleServedTableOrder(orderData?._id);
  };
  const handleCheckoutTable = () => {
    if (!orderData?._id) {
      toast.error("Error checking out order");
    }
    if (!paymentType) {
      toast.error("Please select a payment type.");
      return;
    }

    handleCheckOutTableOrder({ tableId: orderData?._id, paymentType });
  };

  const itemAllServed = items.every((item) => item.orderServed);

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
                sx={{
                  background: "linear-gradient(90deg, #ff5722, #ff9800)",
                  color: "white",
                  fontWeight: "bold",
                }}
              />
            </Box>
            <Chip
              label="ACTIVE"
              sx={{
                background: "linear-gradient(90deg, #ff5722, #ff9800)",
                color: "white",
                fontWeight: "bold",
              }}
            />
          </Box>

          <Box className={styles.orderMeta}>
            <Box className={styles.metaItem}>
              <AccessTimeIcon
                sx={{
                  color: "#ff5722",
                }}
                className={styles.metaIcon}
              />
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.mode === "dark" ? "#fff" : "inherit",
                }}
              >
                {formatDate(createdAt)}
              </Typography>
            </Box>
            <Box className={styles.metaItem}>
              <PersonIcon
                sx={{
                  color: "#ff5722",
                }}
                className={styles.metaIcon}
              />
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.mode === "dark" ? "#fff" : "inherit",
                }}
              >
                Ordered by: {orderBy === "staff" ? "Staff" : "Customer"}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider />

        {/* Items */}
        <Box className={styles.itemsSection}>
          <Typography
            variant="h6"
            className={styles.sectionTitle}
            sx={{
              background: "linear-gradient(90deg, #ff5722, #ff9800)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: "bold",
            }}
          >
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
                        border: "2px solid #ff5722",
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
                        sx={{
                          background:
                            "linear-gradient(90deg, #ff5722, #ff9800)",
                          color: "white",
                          fontSize: "0.75rem",
                          width: "fit-content",
                        }}
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

                  {/* Right Side: Quantity + Price + Delete */}
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
                      sx={{
                        background: "linear-gradient(90deg, #ff5722, #ff9800)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      ₹{item.price * item.quantity}
                    </Typography>
                    <IconButton
                      onClick={() => handleDeleteItem(item.menuItem._id)}
                      color="error"
                      size="small"
                      disabled={isDeleting || item?.orderServed}
                      sx={{
                        mt: 1,
                        "&:hover": {
                          background: "rgba(255, 87, 34, 0.1)",
                        },
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
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
            <Typography
              sx={{
                background: "linear-gradient(90deg, #ff5722, #ff9800)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: "bold",
                fontSize: "1.1rem",
              }}
            >
              ₹{total}
            </Typography>
          </Box>

          {/* Action Buttons */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              gap: 2,
              mt: 2,
              alignItems: "center",
            }}
          >
            {/* Left side - Cancel Table button */}
            <Button
              variant="outlined"
              color="error"
              startIcon={<CancelIcon />}
              disabled={itemAllServed}
              onClick={handleCancelTable}
              sx={{
                borderColor: "#ff5722",
                color: "#ff5722",
                background: "transparent",
                whiteSpace: "nowrap",
                "&:hover": {
                  borderColor: "#ff5722",
                  backgroundColor: "rgba(255, 87, 34, 0.1)",
                },
                "&.Mui-disabled": {
                  borderColor: "#ffccbc",
                  color: "#ffccbc",
                  background: "linear-gradient(90deg, #ff5722, #ff9800)",
                  opacity: 0.5,
                  cursor: "not-allowed",
                },
              }}
            >
              Cancel Table
            </Button>

            {/* Right side - Served, Payment Type, and Checkout buttons */}
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <Button
                variant="contained"
                color="success"
                disabled={itemAllServed}
                onClick={handleServedTable}
                sx={{
                  background: "linear-gradient(90deg, #4caf50, #8bc34a)",
                  "&:hover": {
                    background: "linear-gradient(90deg, #45a049, #7cb342)",
                  },
                  "&.Mui-disabled": {
                    background: "linear-gradient(90deg, #c8e6c9, #e8f5e9)",
                    color: "#a5a5a5",
                    opacity: 0.7,
                    cursor: "not-allowed",
                  },
                }}
              >
                Served
              </Button>
              {/* Payment Type Radio Buttons */}
              <FormControl sx={{ ml: 2 }}>
                <RadioGroup
                  row
                  value={paymentType}
                  onChange={(e) => setPaymentType(e.target.value)}
                  name="payment-type"
                >
                  <FormControlLabel
                    value="online"
                    control={
                      <Radio
                        sx={{
                          color: "#ff9800",
                          "&.Mui-checked": {
                            color: "#ff5722",
                          },
                        }}
                      />
                    }
                    label="Online"
                  />
                  <FormControlLabel
                    value="cash"
                    control={
                      <Radio
                        sx={{
                          color: "#ff9800",
                          "&.Mui-checked": {
                            color: "#ff5722",
                          },
                        }}
                      />
                    }
                    label="Cash"
                  />
                </RadioGroup>
              </FormControl>
              <Button
                variant="contained"
                onClick={handleCheckoutTable}
                disabled={!itemAllServed || !paymentType}
                sx={{
                  background: "linear-gradient(90deg, #ff5722, #ff9800)",
                  color: "#ffffff",
                  "&:hover": {
                    background: "linear-gradient(90deg, #e64a19, #f57c00)",
                  },
                  "&.Mui-disabled": {
                    background: "linear-gradient(90deg, #ffccbc, #ffe0b2)",
                    color: "#ffffff",
                    opacity: 0.7,
                    cursor: "not-allowed",
                  },
                }}
              >
                Checkout
              </Button>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default OrderCard;
