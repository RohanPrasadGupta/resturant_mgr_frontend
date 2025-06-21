import React, { useMemo, useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  Grid,
  ToggleButtonGroup,
  ToggleButton,
  useMediaQuery,
  useTheme,
  IconButton,
  Tooltip,
  Stack,
  Zoom,
  Fade,
  Chip,
  Menu,
  MenuItem,
  alpha,
  Divider,
  Alert,
} from "@mui/material";
import {
  TodayOutlined,
  DateRangeOutlined,
  CalendarMonthOutlined,
  CalendarViewWeekOutlined,
  MoreTimeOutlined,
  FilterListOutlined,
} from "@mui/icons-material";
import PieChartComp from "./charts/PieChartComp";
import EachDataDetails from "./charts/EachDataDetails";
import SumChartDetails from "./charts/SumChartDetails";
import BarChartDetails from "./charts/BarChartDetails";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import LoaderComp from "../../LoaderComp/LoadingComp";

const DataVisualize = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const [timeRange, setTimeRange] = useState("overall");
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [animate, setAnimate] = useState(false);

  const {
    isLoading: isUrlLoading,
    isError,
    data: ordersData,
    error,
  } = useQuery({
    queryKey: ["getAdminData"],
    queryFn: async () => {
      const response = await fetch(
        `https://resturant-mgr-backend.onrender.com/api/admin/all-confirm-orders`
      );
      const data = await response.json();

      if (Array.isArray(data)) {
        return data;
      } else if (data?.finalOrders && Array.isArray(data.finalOrders)) {
        return data.finalOrders;
      } else {
        console.error("Unexpected API response structure:", data);
        return [];
      }
    },
    retry: 1,
    staleTime: 30000,
  });
  useEffect(() => {
    setAnimate(true);
  }, []);

  const handleTimeRangeChange = (event, newTimeRange) => {
    if (newTimeRange !== null) {
      setTimeRange(newTimeRange);
    }
  };

  const handleMobileMenuOpen = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setFilterAnchorEl(null);
  };

  const handleMobileFilterChange = (value) => {
    setTimeRange(value);
    handleMobileMenuClose();
  };

  const timeRangeOptions = [
    {
      value: "today",
      label: "Today",
      icon: <TodayOutlined fontSize="small" />,
    },
    {
      value: "weekly",
      label: "Weekly",
      icon: <CalendarViewWeekOutlined fontSize="small" />,
    },
    {
      value: "monthly",
      label: "Monthly",
      icon: <CalendarMonthOutlined fontSize="small" />,
    },
    {
      value: "yearly",
      label: "Yearly",
      icon: <DateRangeOutlined fontSize="small" />,
    },
    {
      value: "overall",
      label: "Overall",
      icon: <MoreTimeOutlined fontSize="small" />,
    },
  ];

  const calculatedData = useMemo(() => {
    const orders = ordersData || [];
    const now = new Date();

    const filteredOrders = orders.filter((order) => {
      const orderDate = new Date(order.createdAt);

      switch (timeRange) {
        case "today":
          return (
            orderDate.getDate() === now.getDate() &&
            orderDate.getMonth() === now.getMonth() &&
            orderDate.getFullYear() === now.getFullYear()
          );
        case "weekly":
          const weekAgo = new Date(now);
          weekAgo.setDate(now.getDate() - 7);
          return orderDate >= weekAgo;
        case "monthly":
          return (
            orderDate.getMonth() === now.getMonth() &&
            orderDate.getFullYear() === now.getFullYear()
          );
        case "yearly":
          return orderDate.getFullYear() === now.getFullYear();
        case "overall":
        default:
          return true;
      }
    });

    let totalAmount = 0;
    let cashAmount = 0;
    let onlineAmount = 0;
    let totalOrders = 0;
    let cashOrders = 0;
    let onlineOrders = 0;

    filteredOrders.forEach((order) => {
      totalAmount += order.total;
      totalOrders += 1;

      if (order.paymentMethod === "cash") {
        cashAmount += order.total;
        cashOrders += 1;
      } else if (order.paymentMethod === "online") {
        onlineAmount += order.total;
        onlineOrders += 1;
      }
    });

    const cashPercentage =
      totalAmount > 0 ? ((cashAmount / totalAmount) * 100).toFixed(2) : "0.00";
    const onlinePercentage =
      totalAmount > 0
        ? ((onlineAmount / totalAmount) * 100).toFixed(2)
        : "0.00";

    return {
      totalAmount,
      cashAmount,
      onlineAmount,
      totalOrders,
      cashOrders,
      onlineOrders,
      paymentBreakdown: {
        cash: {
          amount: cashAmount,
          orders: cashOrders,
          percentage: cashPercentage,
        },
        online: {
          amount: onlineAmount,
          orders: onlineOrders,
          percentage: onlinePercentage,
        },
      },
    };
  }, [ordersData, timeRange]);

  if (isUrlLoading) return <LoaderComp />;

  if (isError) {
    return (
      <Box sx={{ padding: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Error loading data: {error?.message || "Unknown error"}
        </Alert>
        <Typography variant="body1">
          Please try refreshing the page or contact support if the issue
          persists.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        padding: { xs: "16px", sm: "20px", md: "24px" },
        backgroundColor:
          theme.palette.mode === "dark"
            ? alpha(theme.palette.background.paper, 0.4)
            : alpha(theme.palette.background.paper, 0.4),
        borderRadius: "16px",
      }}
    >
      <Fade in={animate} timeout={800}>
        <Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", sm: "center" },
              marginBottom: "24px",
              gap: { xs: 2, sm: 0 },
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                background: "linear-gradient(45deg, #3085C3, #65B741)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: { xs: 1, sm: 0 },
              }}
            >
              Dashboard Analytics
            </Typography>

            {isMobile ? (
              <>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Chip
                    label={
                      timeRangeOptions.find((opt) => opt.value === timeRange)
                        ?.label || "Filter"
                    }
                    color="primary"
                    size="small"
                    icon={
                      timeRangeOptions.find((opt) => opt.value === timeRange)
                        ?.icon
                    }
                    deleteIcon={<FilterListOutlined />}
                    onDelete={handleMobileMenuOpen}
                    onClick={handleMobileMenuOpen}
                    sx={{
                      "& .MuiChip-label": { fontWeight: 500 },
                      boxShadow: "0 2px 5px rgba(0,0,0,0.08)",
                    }}
                  />
                </Box>
                <Menu
                  anchorEl={filterAnchorEl}
                  open={Boolean(filterAnchorEl)}
                  onClose={handleMobileMenuClose}
                  PaperProps={{
                    sx: {
                      borderRadius: "12px",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                      mt: 1.5,
                      minWidth: 180,
                    },
                  }}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                >
                  {timeRangeOptions.map((option, index) => (
                    <React.Fragment key={option.value}>
                      <MenuItem
                        onClick={() => handleMobileFilterChange(option.value)}
                        selected={timeRange === option.value}
                        sx={{
                          py: 1.5,
                          borderLeft:
                            timeRange === option.value
                              ? `3px solid ${theme.palette.primary.main}`
                              : "none",
                          bgcolor:
                            timeRange === option.value
                              ? alpha(theme.palette.primary.main, 0.1)
                              : "transparent",
                        }}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          {option.icon}
                          <Typography>{option.label}</Typography>
                        </Box>
                      </MenuItem>
                      {index < timeRangeOptions.length - 1 && (
                        <Divider sx={{ my: 0.5 }} />
                      )}
                    </React.Fragment>
                  ))}
                </Menu>
              </>
            ) : (
              <ToggleButtonGroup
                value={timeRange}
                exclusive
                onChange={handleTimeRangeChange}
                aria-label="time range"
                size="small"
                color="primary"
                sx={{
                  backgroundColor: theme.palette.background.paper,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  borderRadius: "8px",
                  overflow: "hidden",
                  "& .MuiToggleButton-root": {
                    padding: isTablet ? "8px 12px" : "8px 16px",
                    border: "none",
                    borderRadius: 0,
                    "&.Mui-selected": {
                      backgroundColor: alpha(theme.palette.primary.main, 0.15),
                      color: theme.palette.primary.main,
                      fontWeight: 600,
                    },
                  },
                }}
              >
                {timeRangeOptions.map((option) => (
                  <ToggleButton
                    key={option.value}
                    value={option.value}
                    aria-label={option.label}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.75,
                      textTransform: "none",
                    }}
                  >
                    {option.icon}
                    <Typography
                      variant="body2"
                      component="span"
                      sx={{ display: { xs: "none", sm: "block" } }}
                    >
                      {option.label}
                    </Typography>
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            )}
          </Box>

          <Zoom in={animate} style={{ transitionDelay: "150ms" }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                width: "100%",
                gap: "24px",
              }}
            >
              <Box sx={{ width: { xs: "100%", md: "50%" } }}>
                <Stack spacing={3}>
                  <Box>
                    <SumChartDetails
                      data={calculatedData}
                      timeRange={timeRange}
                    />
                  </Box>

                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: {
                        xs: "1fr",
                        sm: "repeat(2, 1fr)",
                      },
                      gap: "16px",
                    }}
                  >
                    <Box
                      sx={{
                        transition: "transform 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-4px)",
                        },
                      }}
                    >
                      <EachDataDetails
                        data={calculatedData.paymentBreakdown.cash}
                        type="cash"
                        timeRange={timeRange}
                      />
                    </Box>

                    <Box
                      sx={{
                        transition: "transform 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-4px)",
                        },
                      }}
                    >
                      <EachDataDetails
                        data={calculatedData.paymentBreakdown.online}
                        type="online"
                        timeRange={timeRange}
                      />
                    </Box>
                  </Box>
                </Stack>
              </Box>

              <Box
                sx={{
                  width: { xs: "100%", md: "50%" },
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Card
                  elevation={0}
                  sx={{
                    width: "100%",
                    borderRadius: "16px",
                    padding: { xs: "16px", sm: "24px" },
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <PieChartComp
                    cash={calculatedData?.paymentBreakdown?.cash?.amount}
                    online={calculatedData?.paymentBreakdown?.online?.amount}
                    cashPercent={
                      calculatedData?.paymentBreakdown?.cash?.percentage
                    }
                    onlinePercent={
                      calculatedData?.paymentBreakdown?.online?.percentage
                    }
                    timeRange={timeRange}
                  />
                </Card>
              </Box>
            </Box>
          </Zoom>

          <Zoom in={animate} style={{ transitionDelay: "300ms" }}>
            <Box sx={{ width: "100%", marginTop: "32px" }}>
              <BarChartDetails data={{ finalOrders: ordersData }} />
            </Box>
          </Zoom>
        </Box>
      </Fade>
    </Box>
  );
};

export default DataVisualize;
