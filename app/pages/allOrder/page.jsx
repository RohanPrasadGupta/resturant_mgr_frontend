"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
      // "http://localhost:5000/api/orders",
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
  });

  if (dataLoading || isLoading) return <LoaderComp />;

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
          height: "100vh",
          backgroundColor: "#f5f5f5",
        }}
      >
        <Alert severity="error">
          You are not authorized to view this page.
        </Alert>
        <Alert severity="error">Error loading order: {error.message}</Alert>
      </Container>
    );
  }

  return (
    <>
      {data && data.length === 0 && (
        <Container className={styles.errorContainer}>
          <Alert severity="info">No orders found.</Alert>
        </Container>
      )}
      {data &&
        data.length > 0 &&
        data.map((order) => (
          <Box
            key={order._id}
            sx={{
              height: "100vh",
              backgroundColor: "#ffff",
            }}
          >
            <OrderCard orderData={order} />
          </Box>
        ))}
    </>
  );
};

export default page;
