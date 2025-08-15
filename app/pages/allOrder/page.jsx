"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Container,
  Alert,
  Box,
  useTheme,
  Button,
  Typography,
  alpha,
} from "@mui/material";
import OrderCard from "../../components/ordersCards/OrderCard";
import LoaderComp from "../../components/LoaderComp/LoadingComp";
import axios from "axios";
import toast from "react-hot-toast";
import HomeIcon from "@mui/icons-material/Home";

const page = () => {
  const theme = useTheme();
  // const [localStorageData, setLocalStorageData] = useState(null);
  const queryClient = useQueryClient();
  const [ordersID, setOrdersID] = useState("");

  // useEffect(() => {
  //   const storedData =
  //     typeof window !== "undefined"
  //       ? JSON.parse(localStorage.getItem("mgrUserData") || "null")
  //       : null;

  //   setLocalStorageData(storedData);
  //   setIsLoading(false);
  // }, []);

  const getOrder = async () => {
    const response = await axios.get(
      process.env.NODE_ENV === "development"
        ? `${process.env.LOCAL_BACKEND}/api/orders`
        : `${process.env.PROD_BACKEDN}/api/orders`,
      {
        withCredentials: true,
      }
    );
    if (response.data.error) {
      throw new Error(response.data.error);
    }

    return response.data.orders || [];
  };

  const {
    isLoading: dataLoading,
    data,
    error,
    refetch,
  } = useQuery({
    queryKey: ["getOrder"],
    queryFn: getOrder,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchInterval: false,
    staleTime: 0,
    cacheTime: 0,
  });

  useEffect(() => {
    console.log("Data fetched:", data);
    console.log("Data error:", error);
  }, [data, error]);

  const deleteItemOrder = async (itemId) => {
    const response = await axios.put(
      process.env.NODE_ENV === "development"
        ? `${process.env.LOCAL_BACKEND}/api/order/${ordersID}/remove-item`
        : `${process.env.PROD_BACKEDN}/api/order/${ordersID}/remove-item`,
      {
        menuItemId: itemId,
      },
      {
        withCredentials: true,
      }
    );
    return response.data;
  };

  const deleteItemMutation = useMutation({
    mutationFn: deleteItemOrder,
    onSuccess: async () => {
      toast.success("Item deleted successfully!");
      await queryClient.refetchQueries({ queryKey: ["getOrder"] });
      refetch();
    },
    onError: (error) => {
      console.error("Error deleting item:", error);
    },
  });

  const { mutate: deleteAllOrderMutation } = useMutation({
    mutationFn: ({ tableId }) =>
      fetch(
        process.env.NODE_ENV === "development"
          ? `${process.env.LOCAL_BACKEND}/api/order/${tableId}`
          : `${process.env.PROD_BACKEDN}/api/order/${tableId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      ),
    onSuccess: async () => {
      toast.success("Item deleted successfully!");
      await queryClient.refetchQueries({ queryKey: ["getOrder"] });
      refetch();
    },
    onError: (error) => {
      console.error("Error deleting item:", error);
    },
  });

  const { mutate: servedOrderMutation, isPending: servedOrderPending } =
    useMutation({
      mutationFn: ({ tableId }) =>
        fetch(
          process.env.NODE_ENV === "development"
            ? `${process.env.LOCAL_BACKEND}/api/order/${tableId}/mark-all-served`
            : `${process.env.PROD_BACKEDN}/api/order/${tableId}/mark-all-served`,
          {
            method: "PUT",
            credentials: "include",
          }
        ),
      onSuccess: async (data) => {
        toast.success("Table Served");
        await queryClient.refetchQueries({ queryKey: ["getOrder"] });
        refetch();
      },
      onError: (error) => {
        console.error("Error deleting item:", error);
      },
    });

  const { mutate: checkoutOrderMutation } = useMutation({
    mutationFn: async ({ tableId, paymentType }) => {
      const response = await fetch(
        process.env.NODE_ENV === "development"
          ? `${process.env.LOCAL_BACKEND}/api/order/${tableId}/complete`
          : `${process.env.PROD_BACKEDN}/api/order/${tableId}/complete`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paymentMethod: paymentType,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to complete order");
      }
      return response.json();
    },
    onSuccess: async () => {
      toast.success("Order Completed");
      await queryClient.refetchQueries({ queryKey: ["getOrder"] });
      refetch();
    },
    onError: (error) => {
      console.error("Error completing order:", error);
      toast.error("Error completing order.");
    },
  });

  const handleCheckOutTableOrder = ({ tableId, paymentType }) => {
    checkoutOrderMutation({ tableId, paymentType });
  };

  const handleServedTableOrder = (tableId) => {
    servedOrderMutation({ tableId });
  };

  const handleDeleteAllTableOrder = (tableId) => {
    deleteAllOrderMutation({ tableId });
  };

  const handleDeleteItem = (itemId) => {
    deleteItemMutation.mutate(itemId);
  };

  if (dataLoading) return <LoaderComp />;

  if (error) {
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
          minHeight: "100vh",
          backgroundColor:
            theme.palette.mode === "dark"
              ? alpha(theme.palette.background.default, 0.95)
              : "#f8f9fa",
        }}
      >
        <Box
          sx={{
            textAlign: "center",
            backgroundColor: "#f8f9fa",
            padding: { xs: 3, sm: 5 },
            borderRadius: 3,
            boxShadow:
              theme.palette.mode === "dark"
                ? "#f8f9fa"
                : "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontWeight: 700,
              color: "#ff5722",
            }}
          >
            Access Denied
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#555",
              mb: 3,
            }}
          >
            Only staff are allowed to access this page.
          </Typography>

          <Button
            variant="contained"
            href="/pages/home"
            startIcon={<HomeIcon />}
            sx={{
              px: 4,
              py: 1.5,
              background: "linear-gradient(45deg, #ff9800, #ff5722)",
              borderRadius: 2,
              boxShadow: "0 4px 10px rgba(255, 87, 34, 0.3)",
              textTransform: "none",
              fontWeight: 600,
              color: "#fff",
              "&:hover": {
                boxShadow: "0 6px 15px rgba(255, 87, 34, 0.4)",
                transform: "translateY(-2px)",
              },
              transition: "all 0.3s ease",
            }}
          >
            Go to Home
          </Button>
        </Box>
      </Container>
    );
  }

  if (data?.length === 0) {
    return (
      <Box
        sx={{
          width: "100%",
          minHeight: "95vh",
          backgroundColor:
            theme.palette.mode === "dark"
              ? theme.palette.background.default
              : theme.palette.background.paper,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color:
            theme.palette.mode === "dark"
              ? theme.palette.text.primary
              : "inherit",
          transition: "background-color .3s ease",
        }}
      >
        <Alert severity="info">No orders found.</Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        backgroundColor:
          theme.palette.mode === "dark"
            ? theme.palette.background.default
            : theme.palette.background.paper,
        overflowY: "auto",
        overflowX: "hidden",
        padding: 3,
        boxSizing: "border-box",
        width: "100%",
        minHeight: "95vh",
        transition: "background-color .3s ease",
        color:
          theme.palette.mode === "dark"
            ? theme.palette.text.primary
            : "inherit",
      }}
    >
      <Container maxWidth="md">
        {Array.isArray(data) &&
          data.map((order) => (
            <Box key={order._id} sx={{ mb: 4 }}>
              <OrderCard
                orderData={order}
                onDeleteItem={handleDeleteItem}
                setOrdersID={setOrdersID}
                isDeleting={deleteItemMutation.isPending}
                tableOrdersID={order._id}
                handleDeleteAllTableOrder={handleDeleteAllTableOrder}
                handleServedTableOrder={handleServedTableOrder}
                handleCheckOutTableOrder={handleCheckOutTableOrder}
              />
            </Box>
          ))}
      </Container>
    </Box>
  );
};

export default page;
