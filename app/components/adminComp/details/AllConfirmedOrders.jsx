import React, { useEffect } from "react";
import CompleteORderCard from "./completeOrders/CompleteORderCard";
import { useQuery } from "@tanstack/react-query";
import LoaderComp from "../../LoaderComp/LoadingComp";

export default function AllConfirmedOrders() {
  const { isLoading, data, error, refetch } = useQuery({
    queryKey: ["getCompletedOrder"],
    queryFn: async () => {
      const res = await fetch(
        process.env.NODE_ENV === "development"
          ? `${process.env.LOCAL_BACKEND}/api/admin/all-confirm-orders`
          : `${process.env.PROD_BACKEND}/api/admin/all-confirm-orders`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      return res.json();
    },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    staleTime: 0,
    cacheTime: 0,
  });

  useEffect(() => {
    console.log("data", data);
  }, [data]);

  if (isLoading) return <LoaderComp />;

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

  return (
    <div>
      <CompleteORderCard orders={data} />
    </div>
  );
}
