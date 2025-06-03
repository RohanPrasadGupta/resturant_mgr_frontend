"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Container, Alert, Box, Button, Typography } from "@mui/material";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import styles from "./orderStyle.module.scss";
import LoaderComp from "@/app/components/LoaderComp/LoadingComp";
import OrderCard from "@/app/components/ordersCards/OrderCard";

const OrderPage = () => {
  const userData = useSelector((state) => state.selectedUser.value);
  const queryClient = useQueryClient();
  const [localStorageData, setLocalStorageData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tableNumber, setTableNumber] = useState("");

  // Step 1: Get the table number from localStorage or Redux first
  useEffect(() => {
    // Get data from localStorage after component mounts (client-side only)
    if (typeof window !== "undefined") {
      const storedData = JSON.parse(
        localStorage.getItem("mgrUserData") || "null"
      );
      setLocalStorageData(storedData);

      // Set table number from Redux or localStorage
      const tableFromRedux = userData?.tableNumber;
      const tableFromStorage = storedData?.tableNumber;

      if (tableFromRedux) {
        setTableNumber(tableFromRedux);
      } else if (tableFromStorage) {
        setTableNumber(tableFromStorage);
      }

      setIsLoading(false);
    }
  }, [userData]);

  // Identify user type for potential UI differences
  const isCustomer =
    userData?.username === "customer" ||
    localStorageData?.username === "customer";

  // Step 2: Only enable the query when we have a table number
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["getCustomerOrder", tableNumber],
    queryFn: () => {
      if (!tableNumber) {
        throw new Error("No table number available");
      }
      return fetch(
        `https://resturant-mgr-backend.onrender.com/api/order/table-number/${tableNumber}`
      ).then((res) => res.json());
    },
    enabled: !!tableNumber && !isLoading, // Only run query when tableNumber is available
    retry: 1,
    staleTime: 30000, // Cache results for 30 seconds
  });

  // For debugging
  useEffect(() => {
    console.log("Current table number:", tableNumber);
    console.log("Order data:", data);
  }, [tableNumber, data]);

  // Show loading state
  if (isLoading || isPending) return <LoaderComp />;

  // Show error state
  if (isError) {
    return (
      <Container className={styles.errorContainer}>
        <Alert severity="error" className={styles.errorAlert}>
          {error.message === "No table number available"
            ? "Please select a table to view orders"
            : `Error loading order: ${error.message}`}
        </Alert>
      </Container>
    );
  }

  // No table number selected
  if (!tableNumber) {
    return (
      <Container className={styles.emptyStateContainer}>
        <Box className={styles.emptyStateBox}>
          <Typography variant="h5" gutterBottom>
            No Table Selected
          </Typography>
          <Typography variant="body1" color="textSecondary" paragraph>
            Please select a table to view orders.
          </Typography>
        </Box>
      </Container>
    );
  }

  // No active order for this table
  if (data?.message === "No active order found for this table number") {
    return (
      <Container className={styles.noOrderContainer}>
        <Box className={styles.noOrderContent}>
          <RestaurantMenuIcon className={styles.noOrderIcon} />
          <Typography variant="h5" className={styles.noOrderTitle}>
            No Active Orders
          </Typography>
          <Typography variant="body1" className={styles.noOrderText}>
            There are no active orders for table {tableNumber}.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            href="/pages/menu"
            className={styles.browseMenuButton}
          >
            Browse Menu
          </Button>
        </Box>
      </Container>
    );
  }

  // Show order data
  return (
    <Container className={styles.pageContainer}>
      <OrderCard orderData={data?.order} />
    </Container>
  );
};

export default OrderPage;
