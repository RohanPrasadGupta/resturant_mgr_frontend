"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Container, Alert, Box, useTheme } from "@mui/material";
import OrderCard from "../../components/ordersCards/OrderCard";
import LoaderComp from "../../components/LoaderComp/LoadingComp";
import axios from "axios";
import toast from "react-hot-toast";

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
    return response.data;
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
      <Box
        sx={{
          width: "100%",
          height: "95vh",
          backgroundColor:
            theme.palette.mode === "dark"
              ? theme.palette.background.default
              : "#f5f5f5",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 2,
          color:
            theme.palette.mode === "dark"
              ? theme.palette.text.primary
              : "inherit",
          transition: "background-color .3s ease",
        }}
      >
        <Alert severity="error">Error loading order: {error.message}</Alert>
      </Box>
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
        {data.map((order) => (
          <Box
            key={order._id}
            sx={{
              mb: 4,
            }}
          >
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
