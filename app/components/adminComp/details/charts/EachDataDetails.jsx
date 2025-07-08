import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Divider,
  useTheme,
  alpha,
  useMediaQuery,
  Stack,
  Tooltip,
} from "@mui/material";
import PaymentsIcon from "@mui/icons-material/Payments";
import BookOnlineIcon from "@mui/icons-material/BookOnline";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ReceiptIcon from "@mui/icons-material/Receipt";
import PercentIcon from "@mui/icons-material/Percent";
import ShowChartIcon from "@mui/icons-material/ShowChart";

const EachDataDetails = ({ data, type = "cash", timeRange }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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

  const getGradient = () => {
    return type === "cash"
      ? "linear-gradient(135deg, #43a047 0%, #2e7d32 100%)"
      : "linear-gradient(135deg, #2196f3 0%, #1565c0 100%)";
  };

  const getTimeRangeLabel = () => {
    const labels = {
      today: "Today",
      weekly: "This Week",
      monthly: "This Month",
      yearly: "This Year",
      overall: "Overall",
    };
    return labels[timeRange] || "Overall";
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "NPR",
      maximumFractionDigits: 0,
    })
      .format(amount)
      .replace("NPR", "Rs.");
  };

  // Calculate percentage growth (mock data for demo)
  const getPercentageChange = () => {
    return type === "cash" ? 8.5 : 12.3;
  };

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: "20px",
        overflow: "hidden",
        position: "relative",
        transition: "all 0.3s ease",
        background:
          theme.palette.mode === "dark"
            ? alpha(theme.palette.background.paper, 0.8)
            : theme.palette.background.paper,
        boxShadow: `0 8px 32px 0 ${alpha(getColor(), 0.1)}`,
        border: `1px solid ${alpha(getColor(), 0.15)}`,
        "&:hover": {
          boxShadow: `0 12px 28px 0 ${alpha(getColor(), 0.18)}`,
          transform: "translateY(-5px)",
        },
      }}
    >
      {/* Top gradient bar */}
      <Box
        sx={{
          height: "8px",
          background: getGradient(),
        }}
      />

      <CardContent
        sx={{
          padding: { xs: "16px", sm: "24px" },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "16px",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Box
              sx={{
                backgroundColor: alpha(getColor(), 0.1),
                borderRadius: "12px",
                padding: "8px",
                display: "flex",
              }}
            >
              {getPaymentIcon()}
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: theme.palette.mode === "dark" ? "#fff" : "#333",
                  textTransform: "capitalize",
                }}
              >
                {type} Payment
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {getTimeRangeLabel()}
              </Typography>
            </Box>
          </Box>

          <Tooltip title="Revenue share">
            <Chip
              icon={<PercentIcon sx={{ fontSize: "0.875rem !important" }} />}
              label={`${data.percentage}%`}
              size="small"
              sx={{
                backgroundColor: alpha(getColor(), 0.1),
                color: getColor(),
                fontWeight: 600,
                "& .MuiChip-icon": {
                  color: getColor(),
                },
              }}
            />
          </Tooltip>
        </Box>

        <Divider
          sx={{
            marginBottom: "20px",
            opacity: 0.7,
          }}
        />

        <Box sx={{ marginBottom: "24px" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "12px",
            }}
          >
            <TrendingUpIcon sx={{ color: getColor(), fontSize: 18 }} />
            <Typography
              variant="body2"
              sx={{ color: "text.secondary", fontWeight: 500 }}
            >
              Total Amount
            </Typography>
          </Box>
          <Stack
            direction="row"
            alignItems="baseline"
            spacing={1.5}
            sx={{ mb: 0.5 }}
          >
            <Typography
              variant={isMobile ? "h5" : "h4"}
              sx={{
                fontWeight: 700,
                color: getColor(),
                letterSpacing: "-0.5px",
              }}
            >
              {formatCurrency(data.amount)}
            </Typography>

            <Chip
              size="small"
              icon={<ShowChartIcon sx={{ fontSize: "0.75rem !important" }} />}
              label={`+${getPercentageChange()}%`}
              sx={{
                height: 20,
                fontSize: "0.75rem",
                backgroundColor: alpha("#4caf50", 0.1),
                color: "#4caf50",
                fontWeight: 600,
                "& .MuiChip-icon": {
                  color: "#4caf50",
                },
              }}
            />
          </Stack>

          {/* Progress Bar for Amount Percentage */}
          <Box sx={{ mt: 3, mb: 1 }}>
            <LinearProgress
              variant="determinate"
              value={parseFloat(data.percentage)}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: alpha(getColor(), 0.1),
                "& .MuiLinearProgress-bar": {
                  background: getGradient(),
                  borderRadius: 4,
                  transition: "transform 1s ease-in-out",
                },
              }}
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mt: 0.5,
              }}
            >
              <Typography variant="caption" color="text.secondary">
                0%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                100%
              </Typography>
            </Box>
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
            <ReceiptIcon sx={{ color: getColor(), fontSize: 18 }} />
            <Typography
              variant="body2"
              sx={{ color: "text.secondary", fontWeight: 500 }}
            >
              Total Orders
            </Typography>
          </Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              color: theme.palette.mode === "dark" ? "#fff" : "#333",
            }}
          >
            {data.orders}
          </Typography>
        </Box>

        {/* Additional Stats */}
        <Box
          sx={{
            marginTop: "20px",
            padding: "16px",
            backgroundColor: alpha(getColor(), 0.05),
            borderRadius: "12px",
            border: `1px solid ${alpha(getColor(), 0.1)}`,
            backdropFilter: "blur(5px)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "120px",
              height: "120px",
              background: `radial-gradient(circle, ${alpha(
                getColor(),
                0.2
              )} 0%, transparent 70%)`,
              transform: "translate(30%, -30%)",
              borderRadius: "50%",
            }}
          />

          <Typography
            variant="body2"
            sx={{ color: "text.secondary", marginBottom: "8px" }}
          >
            Average Order Value
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: getColor(),
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            {data.orders
              ? formatCurrency(data.amount / data.orders)
              : formatCurrency(0)}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default EachDataDetails;
