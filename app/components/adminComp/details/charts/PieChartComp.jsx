import {
  Box,
  Typography,
  Paper,
  Chip,
  Stack,
  useTheme,
  useMediaQuery,
  alpha,
  Card,
  Tooltip,
  IconButton,
} from "@mui/material";
import React, { useState } from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import PaymentsIcon from "@mui/icons-material/Payments";
import BookOnlineIcon from "@mui/icons-material/BookOnline";
import DonutLargeIcon from "@mui/icons-material/DonutLarge";

const PieChartComp = ({
  cash,
  online,
  cashPercent,
  onlinePercent,
  timeRange,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const [activeIndex, setActiveIndex] = useState(null);

  const themeColors = {
    primary: "#ff5722",
    secondary: "#ff9800",
    gradient: "linear-gradient(135deg, #ff5722, #ff9800)",
    darkGradient: "linear-gradient(135deg, #bf360c, #e65100)",
  };

  const cashValue =
    typeof cash === "string" ? parseFloat(cash) || 0 : cash || 0;
  const onlineValue =
    typeof online === "string" ? parseFloat(online) || 0 : online || 0;
  const total = cashValue + onlineValue;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "NPR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .format(amount)
      .replace("NPR", "Rs.");
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

  if (cashValue === 0 && onlineValue === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: { xs: "24px", sm: "40px" },
          height: { xs: "300px", sm: "400px" },
          background:
            theme.palette.mode === "dark"
              ? "linear-gradient(135deg, #bf360c 0%, #e65100 100%)"
              : "linear-gradient(135deg, #ffccbc 0%, #ffe0b2 100%)",
          borderRadius: "16px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
        }}
      >
        <DonutLargeIcon
          sx={{
            fontSize: { xs: 56, sm: 72 },
            color:
              theme.palette.mode === "dark" ? "#ffccbc" : themeColors.primary,
            mb: 2,
            animation: "pulse 2s infinite ease-in-out",
            "@keyframes pulse": {
              "0%": { opacity: 0.6, transform: "scale(0.95)" },
              "50%": { opacity: 0.9, transform: "scale(1.05)" },
              "100%": { opacity: 0.6, transform: "scale(0.95)" },
            },
          }}
        />
        <Typography
          variant="h6"
          color={theme.palette.mode === "dark" ? "white" : themeColors.primary}
          align="center"
          sx={{ mb: 1, fontWeight: 600 }}
        >
          No payment data available
        </Typography>
        <Typography
          variant="body2"
          color={
            theme.palette.mode === "dark"
              ? "rgba(255,255,255,0.7)"
              : "text.secondary"
          }
          align="center"
        >
          {getTimeRangeLabel()} period has no transactions
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
    <Card
      elevation={0}
      sx={{
        padding: { xs: "16px", sm: "20px", md: "24px" },
        background:
          theme.palette.mode === "dark"
            ? themeColors.darkGradient
            : themeColors.gradient,
        borderRadius: "20px",
        color: "white",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.22)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.03,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
        }}
      />

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          position: "relative",
          zIndex: 1,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            fontSize: { xs: "1.1rem", sm: "1.25rem" },
            textShadow: "0 2px 4px rgba(0,0,0,0.2)",
          }}
        >
          {getTimeRangeLabel()} Payment Distribution
        </Typography>
      </Box>

      <Paper
        elevation={0}
        sx={{
          borderRadius: "20px",
          padding: { xs: "12px", sm: "20px" },
          backgroundColor: alpha("#fff", 0.95),
          backdropFilter: "blur(10px)",
          marginBottom: { xs: "16px", sm: "24px" },
          boxShadow: "0 8px 32px rgba(31, 38, 135, 0.15)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 12px 48px rgba(31, 38, 135, 0.2)",
          },
        }}
      >
        <Box
          sx={{
            width: { xs: 280, sm: 320 },
            height: { xs: 240, sm: 280 },
            position: "relative",
          }}
        >
          <PieChart
            series={[
              {
                data: chartData,
                innerRadius: isMobile ? 50 : 60,
                outerRadius: isMobile ? 100 : 120,
                paddingAngle: 3,
                cornerRadius: 8,
                startAngle: -90,
                endAngle: 270,
                highlightScope: { faded: "global", highlighted: "item" },
                faded: {
                  innerRadius: isMobile ? 25 : 30,
                  additionalRadius: -30,
                  color: "gray",
                },
                arcLabel: (item) => "",
                onItemClick: (event, itemIndex, item) => {
                  setActiveIndex(itemIndex === activeIndex ? null : itemIndex);
                },
                highlight: activeIndex !== null ? activeIndex : undefined,
              },
            ]}
            width={isMobile ? 280 : 320}
            height={isMobile ? 240 : 280}
            slotProps={{
              legend: {
                hidden: true,
              },
            }}
          />
        </Box>
      </Paper>

      <Stack
        spacing={{ xs: 1.5, sm: 2 }}
        sx={{ position: "relative", zIndex: 1, flex: 1 }}
      >
        <Paper
          elevation={0}
          sx={{
            padding: { xs: "12px", sm: "16px" },
            borderRadius: "16px",
            backgroundColor: alpha("#fff", 0.08),
            backdropFilter: "blur(10px)",
            border: `1px solid ${alpha("#fff", 0.15)}`,
            transition: "all 0.3s ease",
            transform: activeIndex === 0 ? "scale(1.03)" : "scale(1)",
            boxShadow:
              activeIndex === 0
                ? `0 10px 30px ${alpha(themeColors.secondary, 0.4)}`
                : "none",
            position: "relative",
            overflow: "hidden",
            "&:hover": {
              backgroundColor: alpha("#fff", 0.12),
            },
          }}
        >
          {activeIndex === 0 && (
            <Box
              sx={{
                position: "absolute",
                top: "-50%",
                left: "-50%",
                width: "200%",
                height: "200%",
                background: `radial-gradient(circle, ${alpha(
                  themeColors.secondary,
                  0.2
                )} 0%, transparent 70%)`,
                opacity: 0.7,
                pointerEvents: "none",
              }}
            />
          )}

          <Box
            sx={{
              display: "flex",
              flexDirection: {
                xs: activeIndex === 0 ? "column" : "row",
                sm: "row",
              },
              alignItems: {
                xs: activeIndex === 0 ? "flex-start" : "center",
                sm: "center",
              },
              justifyContent: "space-between",
              gap: { xs: activeIndex === 0 ? 2 : 0, sm: 0 },
              position: "relative",
              zIndex: 1,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                flex: 1,
              }}
            >
              <Box
                sx={{
                  width: { xs: 20, sm: 24 },
                  height: { xs: 20, sm: 24 },
                  borderRadius: "50%",
                  backgroundColor: "#4caf50",
                  boxShadow: "0 0 10px rgba(76, 175, 80, 0.5)",
                }}
              />
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <PaymentsIcon
                  sx={{ color: "white", fontSize: { xs: 18, sm: 20 } }}
                />
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 600,
                    color: "white",
                    fontSize: { xs: "0.9rem", sm: "1rem" },
                  }}
                >
                  Cash Payment
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                textAlign: { xs: "left", sm: "right" },
                display: "flex",
                flexDirection: { xs: "row", sm: "column" },
                alignItems: { xs: "center", sm: "flex-end" },
                gap: { xs: 2, sm: 0.5 },
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: "white",
                  fontSize: { xs: "1.1rem", sm: "1.25rem" },
                }}
              >
                {formatCurrency(cashValue)}
              </Typography>
              <Chip
                label={`${cashPercent}%`}
                size="small"
                sx={{
                  backgroundColor: alpha("#4caf50", 0.25),
                  color: "white",
                  fontWeight: 600,
                  border: "1px solid rgba(76, 175, 80, 0.5)",
                  backdropFilter: "blur(5px)",
                  maxWidth: "64px",
                }}
              />
            </Box>
          </Box>

          {activeIndex === 0 && (
            <Box
              sx={{
                mt: 2,
                pt: 2,
                borderTop: `1px solid ${alpha("#fff", 0.15)}`,
                display: "flex",
                flexWrap: "wrap",
                gap: 3,
              }}
            >
              <Box>
                <Typography variant="caption" sx={{ opacity: 0.7 }}>
                  Average Transaction
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {formatCurrency(
                    cashValue / ((parseFloat(cashPercent) * total) / 100 || 1)
                  )}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ opacity: 0.7 }}>
                  Est. Transaction Count
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  ~{Math.round((parseFloat(cashPercent) * total) / 100)}
                </Typography>
              </Box>
            </Box>
          )}
        </Paper>

        <Paper
          elevation={0}
          sx={{
            padding: { xs: "12px", sm: "16px" },
            borderRadius: "16px",
            backgroundColor: alpha("#fff", 0.08),
            backdropFilter: "blur(10px)",
            border: `1px solid ${alpha("#fff", 0.15)}`,
            transition: "all 0.3s ease",
            transform: activeIndex === 1 ? "scale(1.03)" : "scale(1)",
            boxShadow:
              activeIndex === 1
                ? `0 10px 30px ${alpha(themeColors.secondary, 0.4)}`
                : "none",
            position: "relative",
            overflow: "hidden",
            "&:hover": {
              backgroundColor: alpha("#fff", 0.12),
            },
          }}
        >
          {activeIndex === 1 && (
            <Box
              sx={{
                position: "absolute",
                top: "-50%",
                left: "-50%",
                width: "200%",
                height: "200%",
                background: `radial-gradient(circle, ${alpha(
                  themeColors.secondary,
                  0.2
                )} 0%, transparent 70%)`,
                opacity: 0.7,
                pointerEvents: "none",
              }}
            />
          )}

          <Box
            sx={{
              display: "flex",
              flexDirection: {
                xs: activeIndex === 1 ? "column" : "row",
                sm: "row",
              },
              alignItems: {
                xs: activeIndex === 1 ? "flex-start" : "center",
                sm: "center",
              },
              justifyContent: "space-between",
              gap: { xs: activeIndex === 1 ? 2 : 0, sm: 0 },
              position: "relative",
              zIndex: 1,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                flex: 1,
              }}
            >
              <Box
                sx={{
                  width: { xs: 20, sm: 24 },
                  height: { xs: 20, sm: 24 },
                  borderRadius: "50%",
                  backgroundColor: "#2196f3",
                  boxShadow: "0 0 10px rgba(33, 150, 243, 0.5)",
                }}
              />
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <BookOnlineIcon
                  sx={{ color: "white", fontSize: { xs: 18, sm: 20 } }}
                />
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 600,
                    color: "white",
                    fontSize: { xs: "0.9rem", sm: "1rem" },
                  }}
                >
                  Online Payment
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                textAlign: { xs: "left", sm: "right" },
                display: "flex",
                flexDirection: { xs: "row", sm: "column" },
                alignItems: { xs: "center", sm: "flex-end" },
                gap: { xs: 2, sm: 0.5 },
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: "white",
                  fontSize: { xs: "1.1rem", sm: "1.25rem" },
                }}
              >
                {formatCurrency(onlineValue)}
              </Typography>
              <Chip
                label={`${onlinePercent}%`}
                size="small"
                sx={{
                  backgroundColor: alpha("#2196f3", 0.25),
                  color: "white",
                  fontWeight: 600,
                  border: "1px solid rgba(33, 150, 243, 0.5)",
                  backdropFilter: "blur(5px)",
                  maxWidth: "64px",
                }}
              />
            </Box>
          </Box>

          {activeIndex === 1 && (
            <Box
              sx={{
                mt: 2,
                pt: 2,
                borderTop: `1px solid ${alpha("#fff", 0.15)}`,
                display: "flex",
                flexWrap: "wrap",
                gap: 3,
              }}
            >
              <Box>
                <Typography variant="caption" sx={{ opacity: 0.7 }}>
                  Average Transaction
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {formatCurrency(
                    onlineValue /
                      ((parseFloat(onlinePercent) * total) / 100 || 1)
                  )}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ opacity: 0.7 }}>
                  Est. Transaction Count
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  ~{Math.round((parseFloat(onlinePercent) * total) / 100)}
                </Typography>
              </Box>
            </Box>
          )}
        </Paper>
      </Stack>
    </Card>
  );
};

export default PieChartComp;
