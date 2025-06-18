import { Box, Typography, Paper, Chip, Stack } from "@mui/material";
import React from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import PaymentsIcon from "@mui/icons-material/Payments";
import BookOnlineIcon from "@mui/icons-material/BookOnline";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

const PieChartComp = ({ cash, online, cashPercent, onlinePercent }) => {
  const cashValue =
    typeof cash === "string" ? parseFloat(cash) || 0 : cash || 0;
  const onlineValue =
    typeof online === "string" ? parseFloat(online) || 0 : online || 0;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "NPR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Don't render if no data
  if (cashValue === 0 && onlineValue === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "40px",
          height: "400px",
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          borderRadius: "16px",
        }}
      >
        <TrendingUpIcon sx={{ fontSize: 48, color: "#ccc", mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          No payment data available
        </Typography>
      </Box>
    );
  }

  const chartData = [
    {
      id: "cash",
      value: cashValue,
      label: "Cash",
      color: "#4caf50",
    },
    {
      id: "online",
      value: onlineValue,
      label: "Online",
      color: "#2196f3",
    },
  ];

  return (
    <Box
      sx={{
        padding: "24px",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        borderRadius: "16px",
        color: "white",
      }}
    >
      <Paper
        elevation={8}
        sx={{
          borderRadius: "16px",
          padding: "20px",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          marginBottom: "24px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <PieChart
            series={[
              {
                data: chartData,
                innerRadius: 60,
                outerRadius: 120,
                paddingAngle: 3,
                cornerRadius: 8,
                startAngle: -90,
                endAngle: 270,
                highlightScope: { faded: "global", highlighted: "item" },
                faded: {
                  innerRadius: 30,
                  additionalRadius: -30,
                  color: "gray",
                },
              },
            ]}
            width={320}
            height={280}
            slotProps={{
              legend: {
                hidden: true,
              },
            }}
          />
        </Box>
      </Paper>

      <Stack spacing={2}>
        <Paper
          elevation={2}
          sx={{
            padding: "16px",
            borderRadius: "12px",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  backgroundColor: "#4caf50",
                }}
              />
              <PaymentsIcon sx={{ color: "white", fontSize: 20 }} />
              <Typography
                variant="body1"
                sx={{ fontWeight: 600, color: "white" }}
              >
                Cash Payment
              </Typography>
            </Box>
            <Box sx={{ textAlign: "right" }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: "white" }}>
                {formatCurrency(cashValue)}
              </Typography>
              <Chip
                label={`${cashPercent}%`}
                size="small"
                sx={{
                  backgroundColor: "#4caf50",
                  color: "white",
                  fontWeight: 600,
                }}
              />
            </Box>
          </Box>
        </Paper>

        <Paper
          elevation={2}
          sx={{
            padding: "16px",
            borderRadius: "12px",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  backgroundColor: "#2196f3",
                }}
              />
              <BookOnlineIcon sx={{ color: "white", fontSize: 20 }} />
              <Typography
                variant="body1"
                sx={{ fontWeight: 600, color: "white" }}
              >
                Online Payment
              </Typography>
            </Box>
            <Box sx={{ textAlign: "right" }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: "white" }}>
                {formatCurrency(onlineValue)}
              </Typography>
              <Chip
                label={`${onlinePercent}%`}
                size="small"
                sx={{
                  backgroundColor: "#2196f3",
                  color: "white",
                  fontWeight: 600,
                }}
              />
            </Box>
          </Box>
        </Paper>
      </Stack>
    </Box>
  );
};

export default PieChartComp;
