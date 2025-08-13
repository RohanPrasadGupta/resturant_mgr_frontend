import React, { useMemo, useState } from "react";
import CompleteORderCard from "./completeOrders/CompleteORderCard";
import LoaderComp from "../../LoaderComp/LoadingComp";
import { useCompletedOrders } from "../../../services/admin/confirmOrder/ConfirmedOrderApi";
import {
  Alert,
  Box,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";

export default function AllConfirmedOrders() {
  const { isLoading, data, error } = useCompletedOrders();
  const [range, setRange] = useState("today");

  const handleRange = (_e, next) => {
    if (next) setRange(next);
  };

  const filtered = useMemo(() => {
    const orders = data?.finalOrders || [];
    if (!orders.length) return [];
    if (range === "all") return orders;

    const now = new Date();
    const start = new Date(now);

    switch (range) {
      case "today":
        start.setHours(0, 0, 0, 0);
        break;
      case "week": {
        const day = now.getDay();
        const diff = (day + 6) % 7;
        start.setDate(now.getDate() - diff);
        start.setHours(0, 0, 0, 0);
        break;
      }
      case "month":
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
        break;
      case "year":
        start.setMonth(0, 1);
        start.setHours(0, 0, 0, 0);
        break;
      default:
        return orders;
    }

    return orders.filter((o) => {
      const d = new Date(o.createdAt);
      return d >= start && d <= now;
    });
  }, [data?.finalOrders, range]);

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
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        p: { xs: 2, sm: 3 },
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "stretch", sm: "center" }}
        justifyContent="space-between"
        spacing={1.5}
        sx={{ mb: 1 }}
      >
        <Typography variant="h6" fontWeight={700}>
          Completed Orders
        </Typography>
        <ToggleButtonGroup
          value={range}
          exclusive
          onChange={handleRange}
          size="small"
          color="primary"
          sx={{ flexWrap: "wrap" }}
        >
          <ToggleButton value="today">Today</ToggleButton>
          <ToggleButton value="week">This Week</ToggleButton>
          <ToggleButton value="month">This Month</ToggleButton>
          <ToggleButton value="year">This Year</ToggleButton>
          <ToggleButton value="all">All</ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      {filtered.length > 0 ? (
        filtered.map((order) => (
          <CompleteORderCard key={order._id} order={order} />
        ))
      ) : (
        <Alert severity="info">No orders found for selected range.</Alert>
      )}
    </Box>
  );
}
