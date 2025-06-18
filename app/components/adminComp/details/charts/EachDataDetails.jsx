import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Divider,
} from "@mui/material";
import PaymentsIcon from "@mui/icons-material/Payments";
import BookOnlineIcon from "@mui/icons-material/BookOnline";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ReceiptIcon from "@mui/icons-material/Receipt";

const EachDataDetails = ({ data, type = "cash" }) => {
  // Determine the icon and color based on payment type
  const getPaymentIcon = () => {
    return type === "cash" ? (
      <PaymentsIcon sx={{ color: "#4caf50", fontSize: 24 }} />
    ) : (
      <BookOnlineIcon sx={{ color: "#2196f3", fontSize: 24 }} />
    );
  };

  const getColor = () => {
    return type === "cash" ? "#4caf50" : "#2196f3";
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "NPR",
    }).format(amount);
  };

  return (
    <Card
      sx={{
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        border: `2px solid ${getColor()}20`,
        marginBottom: "16px",
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
          borderColor: `${getColor()}40`,
        },
      }}
    >
      <CardContent sx={{ padding: "20px" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "16px",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {getPaymentIcon()}
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: "#333",
                textTransform: "capitalize",
              }}
            >
              {type} Payment
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ marginBottom: "16px" }} />

        <Box sx={{ marginBottom: "20px" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "8px",
            }}
          >
            <TrendingUpIcon sx={{ color: getColor(), fontSize: 20 }} />
            <Typography variant="body2" sx={{ color: "#666", fontWeight: 500 }}>
              Total Amount
            </Typography>
          </Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: getColor(),
              marginBottom: "8px",
            }}
          >
            {formatCurrency(data.amount)}
          </Typography>

          {/* Progress Bar for Amount Percentage */}
          <Box sx={{ marginTop: "8px" }}>
            <LinearProgress
              variant="determinate"
              value={parseFloat(data.percentage)}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: "#f0f0f0",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: getColor(),
                  borderRadius: 4,
                },
              }}
            />
          </Box>
        </Box>

        <Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "8px",
            }}
          >
            <ReceiptIcon sx={{ color: getColor(), fontSize: 20 }} />
            <Typography variant="body2" sx={{ color: "#666", fontWeight: 500 }}>
              Total Orders
            </Typography>
          </Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              color: "#333",
            }}
          >
            {data.orders}
          </Typography>
        </Box>

        {/* Additional Stats */}
        <Box
          sx={{
            marginTop: "16px",
            padding: "12px",
            backgroundColor: `${getColor()}08`,
            borderRadius: "8px",
            border: `1px solid ${getColor()}20`,
          }}
        >
          <Typography
            variant="body2"
            sx={{ color: "#666", marginBottom: "4px" }}
          >
            Average Order Value
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 600, color: getColor() }}>
            {formatCurrency(data.amount / data.orders)}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default EachDataDetails;
