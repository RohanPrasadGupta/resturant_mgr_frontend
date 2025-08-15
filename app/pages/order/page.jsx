"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Container, Alert, Box, Button, Typography } from "@mui/material";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import HomeIcon from "@mui/icons-material/Home";
import styles from "./orderStyle.module.scss";
import LoaderComp from "../../components/LoaderComp/LoadingComp";
import OrderCard from "../../components/ordersCards/OrderCard";

const OrderPage = () => {
  const userData = useSelector((state) => state.selectedUser.value);
  const queryClient = useQueryClient();
  const [localStorageData, setLocalStorageData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tableNumber, setTableNumber] = useState("");

  const themeColors = {
    primary: "#ff5722",
    secondary: "#ff9800",
    gradient: "linear-gradient(135deg, #ff5722, #ff9800)",
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedData = JSON.parse(
        localStorage.getItem("mgrUserData") || "null"
      );
      setLocalStorageData(storedData);

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

  const isCustomer =
    userData?.username === "customer" ||
    localStorageData?.username === "customer";

  const {
    isLoading: dataLoading,
    data,
    error,
  } = useQuery({
    queryKey: ["getCustomerOrder", tableNumber],
    queryFn: () => {
      if (!tableNumber) {
        throw new Error("No table number available");
      }
      return fetch(
        process.env.NODE_ENV === "development"
          ? `${process.env.LOCAL_BACKEND}/api/order/table-number/${tableNumber}`
          : `${process.env.PROD_BACKEDN}/api/order/table-number/${tableNumber}`
      ).then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch order data");
        }
        return res.json();
      });
    },
    enabled: !!tableNumber && !isLoading && isCustomer,
    retry: 1,
    staleTime: 30000,
  });

  if (isLoading || dataLoading) return <LoaderComp />;

  if (!tableNumber || error || !isCustomer) {
    return (
      <Container
        maxWidth={false}
        disableGutters
        sx={{
          width: "100%",
          padding: { xs: "0 16px", sm: "0 24px" },
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#f5f5f5",
        }}
      >
        <Box className={styles.emptyStateBox} sx={{ textAlign: "center" }}>
          <Typography
            variant="h5"
            gutterBottom
            color={!isCustomer ? themeColors.primary : "textSecondary"}
            sx={{ fontWeight: 600 }}
          >
            {!isCustomer ? "Access Denied" : "No Table Selected"}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {!isCustomer
              ? "Only customers can view orders."
              : "Please select a table to view orders."}
          </Typography>
          {!isCustomer && (
            <Button
              variant="contained"
              href="/pages/home"
              startIcon={<HomeIcon />}
              sx={{
                mt: 3,
                px: 3,
                py: 1,
                background: themeColors.gradient,
                borderRadius: "8px",
                boxShadow: "0 4px 10px rgba(255, 87, 34, 0.3)",
                textTransform: "none",
                fontWeight: 600,
                color: "white",
                "&:hover": {
                  boxShadow: "0 6px 15px rgba(255, 87, 34, 0.4)",
                  transform: "translateY(-2px)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Go to Home
            </Button>
          )}
        </Box>
      </Container>
    );
  }

  if (
    !data?.order ||
    data?.message === "No active order found for this table number"
  ) {
    return (
      <Container
        maxWidth={false}
        disableGutters
        sx={{
          width: "100%",
          padding: { xs: "0 16px", sm: "0 24px" },
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#f5f5f5",
        }}
      >
        <Box className={styles.noOrderContent} sx={{ textAlign: "center" }}>
          <RestaurantMenuIcon
            className={styles.noOrderIcon}
            sx={{
              fontSize: 60,
              color: themeColors.primary,
              mb: 2,
            }}
          />
          <Typography
            variant="h5"
            className={styles.noOrderTitle}
            gutterBottom
            sx={{ color: themeColors.primary, fontWeight: 600 }}
          >
            No Active Orders
          </Typography>
          <Typography variant="body1" className={styles.noOrderText} paragraph>
            There are no active orders for table {tableNumber}.
          </Typography>
          <Button
            variant="contained"
            href="/pages/menu"
            className={styles.browseMenuButton}
            sx={{
              background: themeColors.gradient,
              borderRadius: "8px",
              boxShadow: "0 4px 10px rgba(255, 87, 34, 0.3)",
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              py: 1,
              "&:hover": {
                boxShadow: "0 6px 15px rgba(255, 87, 34, 0.4)",
                transform: "translateY(-2px)",
              },
              transition: "all 0.3s ease",
            }}
          >
            Browse Menu
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        width: "100%",
        padding: { xs: "0 16px", sm: "0 24px" },
        height: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      <OrderCard orderData={data?.order} />
    </Container>
  );
};

export default OrderPage;
