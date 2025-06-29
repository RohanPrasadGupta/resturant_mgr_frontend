import React from "react";
import {
  Box,
  Typography,
  Card,
  Grid,
  useTheme,
  useMediaQuery,
  Divider,
  alpha,
  Stack,
} from "@mui/material";
import NepaliCurrencyIcon from "../../../icons/NepaliCurrencyIcon";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import EqualizerOutlinedIcon from "@mui/icons-material/EqualizerOutlined";

const SumChartDetails = ({ data, timeRange }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));

  const themeColors = {
    primary: "#ff5722",
    secondary: "#ff9800",
    gradient: "linear-gradient(90deg, #ff5722, #ff9800)",
  };

  const getTimeRangeLabel = () => {
    const labels = {
      today: "Today's",
      weekly: "Weekly",
      monthly: "Monthly",
      yearly: "Yearly",
      overall: "Overall",
    };
    return labels[timeRange] || "Overall";
  };

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: "20px",
        overflow: "hidden",
        position: "relative",
        background:
          theme.palette.mode === "dark"
            ? "linear-gradient(135deg, #bf360c, #e65100)"
            : "linear-gradient(135deg, #ff5722, #ff9800)",
        color: "white",
        boxShadow: "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.22)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow:
            "0 15px 30px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)",
        },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.05,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <Box
        sx={{
          backdropFilter: "blur(5px)",
          padding: { xs: "20px", sm: "24px", md: "28px" },
          zIndex: 1,
          position: "relative",
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 3 }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              textShadow: "0 2px 4px rgba(0,0,0,0.2)",
              fontSize: { xs: "1.5rem", sm: "1.75rem" },
            }}
          >
            {getTimeRangeLabel()} Summary
          </Typography>

          <Box
            sx={{
              background: alpha("#fff", 0.15),
              borderRadius: "30px",
              padding: "6px 12px",
              backdropFilter: "blur(5px)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                letterSpacing: "0.5px",
              }}
            >
              {new Date().toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })}
            </Typography>
          </Box>
        </Stack>

        <Grid container spacing={isSmall ? 2 : 3}>
          <Grid xs={12} sm={4}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: { xs: "flex-start", sm: "center" },
                padding: { xs: "16px", sm: "20px" },
                gap: "12px",
                background: alpha("#fff", 0.1),
                borderRadius: "16px",
                backdropFilter: "blur(10px)",
                border: `1px solid ${alpha("#fff", 0.15)}`,
                height: "100%",
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  background: alpha("#fff", 0.15),
                },
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "4px",
                  background: "linear-gradient(90deg, #fff, #ffe0b2)",
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <AccountBalanceWalletOutlinedIcon
                  sx={{
                    fontSize: { xs: 20, sm: 24 },
                    color: "#ffffff",
                    filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
                  }}
                />
                <Typography
                  variant="subtitle2"
                  sx={{
                    opacity: 0.9,
                    fontWeight: 500,
                    fontSize: { xs: "0.8rem", sm: "0.875rem" },
                  }}
                >
                  Total Revenue
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  flexWrap: "wrap",
                  justifyContent: { xs: "flex-start", sm: "center" },
                }}
              >
                <NepaliCurrencyIcon fontSize={isMobile ? 28 : 32} />
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: "1.75rem", sm: "2rem", md: "2.25rem" },
                    textShadow: "0 2px 4px rgba(0,0,0,0.2)",
                  }}
                >
                  {data.totalAmount.toLocaleString()}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid xs={12} sm={4}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: { xs: "flex-start", sm: "center" },
                padding: { xs: "16px", sm: "20px" },
                gap: "12px",
                background: alpha("#fff", 0.1),
                borderRadius: "16px",
                backdropFilter: "blur(10px)",
                border: `1px solid ${alpha("#fff", 0.15)}`,
                height: "100%",
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  background: alpha("#fff", 0.15),
                },
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "4px",
                  background: "linear-gradient(90deg, #fff, #ffe0b2)",
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <ShoppingCartOutlinedIcon
                  sx={{
                    fontSize: { xs: 20, sm: 24 },
                    color: "#ffffff",
                    filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
                  }}
                />
                <Typography
                  variant="subtitle2"
                  sx={{
                    opacity: 0.9,
                    fontWeight: 500,
                    fontSize: { xs: "0.8rem", sm: "0.875rem" },
                  }}
                >
                  Total Orders
                </Typography>
              </Box>

              <Box sx={{ textAlign: { xs: "left", sm: "center" } }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: "1.75rem", sm: "2rem", md: "2.25rem" },
                    textShadow: "0 2px 4px rgba(0,0,0,0.2)",
                  }}
                >
                  {data.totalOrders}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid xs={12} sm={4}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: { xs: "flex-start", sm: "center" },
                padding: { xs: "16px", sm: "20px" },
                gap: "12px",
                background: alpha("#fff", 0.1),
                borderRadius: "16px",
                backdropFilter: "blur(10px)",
                border: `1px solid ${alpha("#fff", 0.15)}`,
                height: "100%",
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  background: alpha("#fff", 0.15),
                },
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "4px",
                  background: "linear-gradient(90deg, #fff, #ffe0b2)",
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <EqualizerOutlinedIcon
                  sx={{
                    fontSize: { xs: 20, sm: 24 },
                    color: "#ffffff",
                    filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
                  }}
                />
                <Typography
                  variant="subtitle2"
                  sx={{
                    opacity: 0.9,
                    fontWeight: 500,
                    fontSize: { xs: "0.8rem", sm: "0.875rem" },
                  }}
                >
                  Average Order
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  flexWrap: "wrap",
                  justifyContent: { xs: "flex-start", sm: "center" },
                }}
              >
                <NepaliCurrencyIcon fontSize={isMobile ? 28 : 32} />
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: "1.75rem", sm: "2rem", md: "2.25rem" },
                    textShadow: "0 2px 4px rgba(0,0,0,0.2)",
                  }}
                >
                  {data.totalOrders
                    ? (data.totalAmount / data.totalOrders).toFixed(0)
                    : "0"}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Card>
  );
};

export default SumChartDetails;
