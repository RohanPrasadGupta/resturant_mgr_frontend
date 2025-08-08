"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Container, Alert, Box } from "@mui/material";
import OrderCard from "../../components/ordersCards/OrderCard";
import LoaderComp from "../../components/LoaderComp/LoadingComp";
import axios from "axios";
import toast from "react-hot-toast";

const page = () => {
  // const userData = useSelector((state) => state.selectedUser.value);
  // const [localStorageData, setLocalStorageData] = useState(null);
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(true);
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

  const deleteAllTableOrder = async (tableId) => {
    const response = await axios.delete(
      process.env.NODE_ENV === "development"
        ? `${process.env.LOCAL_BACKEND}/api/order/${tableId}`
        : `${process.env.PROD_BACKEDN}/api/order/${tableId}`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  };

  const deleteAllOrderMutation = useMutation({
    mutationFn: deleteAllTableOrder,
    onSuccess: async () => {
      toast.success("Item deleted successfully!");
      await queryClient.refetchQueries({ queryKey: ["getOrder"] });
      refetch();
    },
    onError: (error) => {
      console.error("Error deleting item:", error);
    },
  });

  const servedTableOrder = async (tableId) => {
    const response = await axios.put(
      process.env.NODE_ENV === "development"
        ? `${process.env.LOCAL_BACKEND}/api/order/${tableId}/mark-all-served`
        : `${process.env.PROD_BACKEDN}/api/order/${tableId}/mark-all-served`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  };

  const servedOrderMutation = useMutation({
    mutationFn: servedTableOrder,
    onSuccess: async () => {
      toast.success("Table Served");
      await queryClient.refetchQueries({ queryKey: ["getOrder"] });
      refetch();
    },
    onError: (error) => {
      console.error("Error deleting item:", error);
    },
  });

  const checkoutTableOrder = async ({ tableId, paymentType }) => {
    const response = await axios.post(
      process.env.NODE_ENV === "development"
        ? `${process.env.LOCAL_BACKEND}/api/order/${tableId}/complete`
        : `${process.env.PROD_BACKEDN}/api/order/${tableId}/complete`,
      {
        paymentMethod: paymentType,
      },
      {
        withCredentials: true,
      }
    );
    return response.data;
  };

  const checkoutOrderMutation = useMutation({
    mutationFn: checkoutTableOrder,
    onSuccess: async () => {
      toast.success("Order Completed");
      await queryClient.refetchQueries({ queryKey: ["getOrder"] });
      refetch();
    },
    onError: (error) => {
      console.error("Error deleting item:", error);
    },
  });

  const handleCheckOutTableOrder = ({ tableId, paymentType }) => {
    checkoutOrderMutation.mutate({ tableId, paymentType });
  };

  const handleServedTableOrder = (tableId) => {
    servedOrderMutation.mutate(tableId);
  };

  const handleDeleteAllTableOrder = (tableId) => {
    deleteAllOrderMutation.mutate(tableId);
  };

  const handleDeleteItem = (itemId) => {
    deleteItemMutation.mutate(itemId);
  };

  if (dataLoading || isLoading) return <LoaderComp />;

  if (error) {
    return (
      <Box
        sx={{
          width: "100%",
          height: "95vh",
          backgroundColor: "#f5f5f5",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 2,
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
          backgroundColor: "#fff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Alert severity="info">No orders found.</Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        backgroundColor: "#fff",
        overflowY: "auto",
        overflowX: "hidden",
        padding: 3,
        boxSizing: "border-box",
        width: "100%",
        minHeight: "95vh",
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
              isDeleting={deleteItemMutation.isPending}
              setOrdersID={setOrdersID}
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
