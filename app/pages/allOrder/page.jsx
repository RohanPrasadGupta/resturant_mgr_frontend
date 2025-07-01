"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Container, Alert, Box } from "@mui/material";
import OrderCard from "../../components/ordersCards/OrderCard";
import LoaderComp from "../../components/LoaderComp/LoadingComp";
import axios from "axios";

const page = () => {
  const userData = useSelector((state) => state.selectedUser.value);
  const queryClient = useQueryClient();
  const [localStorageData, setLocalStorageData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedData =
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("mgrUserData") || "null")
        : null;

    setLocalStorageData(storedData);
    setIsLoading(false);
  }, []);

  const getOrder = async () => {
    const response = await axios.get(
      "https://resturant-mgr-backend.onrender.com/api/orders",
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
  } = useQuery({
    queryKey: ["getOrder"],
    queryFn: getOrder,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: false,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    console.log("data", data);
  }, [data]);

  if (dataLoading || isLoading) return <LoaderComp />;

  if (error) {
    return (
      <Box
        sx={{
          width: "100vw",
          height: "100vh",
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

  return (
    <Box
      sx={{
        backgroundColor: "#fff",
        overflowY: "auto",
        overflowX: "hidden",
        padding: 3,
        boxSizing: "border-box",
      }}
    >
      {data?.length === 0 ? (
        <Container maxWidth="sm">
          <Alert severity="info">No orders found.</Alert>
        </Container>
      ) : (
        <Container maxWidth="md">
          {data.map((order) => (
            <Box
              key={order._id}
              sx={{
                mb: 4,
              }}
            >
              <OrderCard orderData={order} />
            </Box>
          ))}
        </Container>
      )}
    </Box>
  );
};

export default page;
