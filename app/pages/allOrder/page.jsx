"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Container, Alert, Box } from "@mui/material";
import OrderCard from "../../components/ordersCards/OrderCard";
import LoaderComp from "../../components/LoaderComp/LoadingComp";

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

  const isCustomer =
    userData?.username === "customer" ||
    localStorageData?.username === "customer";

  const isStaff =
    userData?.username === "staff" || localStorageData?.username === "staff";

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["getOrder"],
    queryFn: () =>
      fetch(`https://resturant-mgr-backend.onrender.com/api/orders`).then(
        (res) => res.json()
      ),
  });

  useEffect(() => {
    console.log("data", data);
  }, [data]);

  if (isPending || isLoading) return <LoaderComp />;

  if (isError) {
    return (
      <Container className={styles.errorContainer}>
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
