import * as React from "react";
import {
  Box,
  Typography,
  Card,
  FormControl,
  Select,
  MenuItem,
  Button,
  ButtonGroup,
  Stack,
  Divider,
  Chip,
  useTheme,
  alpha,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import BarChartIcon from "@mui/icons-material/BarChart";
import StackedBarChartIcon from "@mui/icons-material/StackedBarChart";

const BarChartDetails = ({ data }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const [timeRange, setTimeRange] = React.useState("monthly");
  const [chartType, setChartType] = React.useState("grouped");

  const themeColors = {
    primary: "#ff5722",
    secondary: "#ff9800",
    gradient: "linear-gradient(90deg, #ff5722, #ff9800)",
  };

  const getDateRange = (range) => {
    const now = new Date();
    const ranges = {
      daily: {
        start: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
        end: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1),
        format: { hour: "2-digit", minute: "2-digit" },
        groupBy: "hour",
      },
      weekly: {
        start: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        end: now,
        format: { weekday: "short", day: "numeric" },
        groupBy: "day",
      },
      monthly: {
        start: new Date(now.getFullYear(), 0, 1),
        end: now,
        format: { month: "short", year: "numeric" },
        groupBy: "month",
      },
      yearly: {
        start: new Date(2024, 0, 1),
        end: now,
        format: { year: "numeric" },
        groupBy: "year",
      },
    };
    return ranges[range];
  };

  const processDataByTimeRange = (data, range) => {
    const rangeConfig = getDateRange(range);
    const groupedData = {};

    let orders = [];
    
    if (Array.isArray(data)) {
      orders = data;
    } else if (data?.finalOrders && Array.isArray(data.finalOrders)) {
      orders = data.finalOrders;
    } else {
      console.error("Unexpected data structure:", data);
      return [];
    }

    const filteredOrders = orders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= rangeConfig.start && orderDate <= rangeConfig.end;
    });

    filteredOrders.forEach((order) => {
      const date = new Date(order.createdAt);
      let key;

      // Group by different time units
      switch (rangeConfig.groupBy) {
        case "hour":
          key = date.toLocaleDateString("en-US", {
            hour: "2-digit",
            hour12: true,
          });
          break;
        case "day":
          key = date.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          });
          break;
        case "month":
          key = date.toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          });
          break;
        case "year":
          key = date.getFullYear().toString();
          break;
        default:
          key = date.toLocaleDateString();
      }

      if (!groupedData[key]) {
        groupedData[key] = {
          period: key,
          cashRevenue: 0,
          onlineRevenue: 0,
          totalRevenue: 0,
          totalOrders: 0,
        };
      }

      groupedData[key].totalOrders += 1;
      groupedData[key].totalRevenue += order.total;

      if (order.paymentMethod === "cash") {
        groupedData[key].cashRevenue += order.total;
      } else {
        groupedData[key].onlineRevenue += order.total;
      }
    });

    return Object.values(groupedData).sort((a, b) => {
      if (rangeConfig.groupBy === "hour") {
        return a.period.localeCompare(b.period);
      }
      return new Date(a.period) - new Date(b.period);
    });
  };

  const chartData = React.useMemo(() => {
    return processDataByTimeRange(data, timeRange);
  }, [data, timeRange]);

  const currencyFormatter = (value) => `Rs. ${value.toLocaleString()}`;

  const totalCashRevenue = chartData.reduce(
    (sum, item) => sum + item.cashRevenue,
    0
  );
  const totalOnlineRevenue = chartData.reduce(
    (sum, item) => sum + item.onlineRevenue,
    0
  );
  const totalOrders = chartData.reduce(
    (sum, item) => sum + item.totalOrders,
    0
  );
  const totalRevenue = totalCashRevenue + totalOnlineRevenue;

  const highestRevenuePeriod =
    chartData.length > 0
      ? chartData.reduce(
          (max, item) =>
            item.cashRevenue + item.onlineRevenue >
            max.cashRevenue + max.onlineRevenue
              ? item
              : max,
          chartData[0]
        )
      : null;

  const getChartSettings = () => {
    const baseHeight = Math.max(350, Math.min(chartData.length * 35, 500));
    const colors = {
      cash: "#4CAF50",
      online: "#2196F3",
    };

    return {
      yAxis: [
        {
          label: "Revenue (NPR)",
          tickSize: 0,
          gridLineDashPattern: [3, 3],
          tickLabelStyle: {
            fontSize: 12,
          },
        },
      ],
      series:
        chartType === "grouped"
          ? [
              {
                dataKey: "cashRevenue",
                label: "Cash",
                valueFormatter: currencyFormatter,
                color: colors.cash,
                highlightScope: {
                  highlighted: "item",
                  faded: "global",
                },
                borderRadius: 4,
              },
              {
                dataKey: "onlineRevenue",
                label: "Online",
                valueFormatter: currencyFormatter,
                color: colors.online,
                highlightScope: {
                  highlighted: "item",
                  faded: "global",
                },
                borderRadius: 4,
              },
            ]
          : [
              {
                dataKey: "cashRevenue",
                label: "Cash",
                valueFormatter: currencyFormatter,
                color: colors.cash,
                highlightScope: {
                  highlighted: "item",
                  faded: "global",
                },
                borderRadius: 4,
                stack: "stack1",
              },
              {
                dataKey: "onlineRevenue",
                label: "Online",
                valueFormatter: currencyFormatter,
                color: colors.online,
                highlightScope: {
                  highlighted: "item",
                  faded: "global",
                },
                borderRadius: 4,
                stack: "stack1",
              },
            ],
      height: baseHeight,
      margin: {
        top: 20,
        bottom: isMobile ? 80 : 60,
        left: isMobile ? 50 : 80,
        right: 20,
      },
      slotProps: {
        legend: {
          position: {
            vertical: "top",
            horizontal: isMobile ? "center" : "right",
          },
          sx: {
            "& .MuiChartLegend-mark": {
              width: 10,
              height: 10,
              marginRight: 5,
            },
            "& .MuiChartLegend-item": {
              marginRight: 15,
            },
          },
        },
      },
    };
  };

  const getTitle = () => {
    const titles = {
      daily: "Today's Revenue by Hour",
      weekly: "Last 7 Days Revenue",
      monthly: "Monthly Revenue Analysis",
      yearly: "Yearly Revenue Comparison",
    };
    return titles[timeRange];
  };

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: "20px",
        padding: { xs: "16px", sm: "24px" },
        background:
          theme.palette.mode === "dark"
            ? "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)"
            : "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
        boxShadow:
          theme.palette.mode === "dark"
            ? "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)"
            : "0 10px 20px rgba(0,0,0,0.05), 0 6px 6px rgba(0,0,0,0.1)",
        transition: "all 0.3s ease-in-out",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          gap: 2,
          marginBottom: "24px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            background: alpha(themeColors.primary, 0.1),
            padding: "8px 16px",
            borderRadius: "12px",
          }}
        >
          <QueryStatsIcon
            sx={{
              fontSize: { xs: 24, sm: 28 },
              filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
              color: themeColors.primary,
            }}
          />
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              background: themeColors.gradient,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontSize: { xs: "1.2rem", sm: "1.5rem" },
            }}
          >
            {getTitle()}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            width: { xs: "100%", sm: "auto" },
            justifyContent: { xs: "space-between", sm: "flex-end" },
          }}
        >
          <ButtonGroup
            variant="outlined"
            size="small"
            aria-label="chart type selection"
            sx={{
              height: 40,
              boxShadow: "0 2px 5px rgba(0,0,0,0.08)",
              borderRadius: "8px",
              overflow: "hidden",
              "& .MuiButtonGroup-grouped": {
                borderColor: alpha(themeColors.primary, 0.5),
                "&:hover": {
                  borderColor: themeColors.primary,
                },
              },
            }}
          >
            <Tooltip title="Grouped Chart">
              <Button
                onClick={() => setChartType("grouped")}
                variant={chartType === "grouped" ? "contained" : "outlined"}
                sx={{
                  borderRadius: "8px 0 0 8px",
                  transition: "all 0.2s ease",
                  minWidth: { xs: "40px", sm: "80px" },
                  ...(chartType === "grouped"
                    ? {
                        background: themeColors.gradient,
                        color: "white",
                        "&:hover": {
                          background: themeColors.gradient,
                          filter: "brightness(1.1)",
                        },
                      }
                    : {
                        color: themeColors.primary,
                        borderColor: alpha(themeColors.primary, 0.5),
                        "&:hover": {
                          borderColor: themeColors.primary,
                          backgroundColor: alpha(themeColors.primary, 0.04),
                        },
                      }),
                }}
              >
                <BarChartIcon
                  sx={{ fontSize: { xs: 16, sm: 18 }, mr: { xs: 0, sm: 0.5 } }}
                />
                {!isMobile && "Grouped"}
              </Button>
            </Tooltip>
            <Tooltip title="Stacked Chart">
              <Button
                onClick={() => setChartType("stacked")}
                variant={chartType === "stacked" ? "contained" : "outlined"}
                sx={{
                  borderRadius: "0 8px 8px 0",
                  transition: "all 0.2s ease",
                  minWidth: { xs: "40px", sm: "80px" },
                  ...(chartType === "stacked"
                    ? {
                        background: themeColors.gradient,
                        color: "white",
                        "&:hover": {
                          background: themeColors.gradient,
                          filter: "brightness(1.1)",
                        },
                      }
                    : {
                        color: themeColors.primary,
                        borderColor: alpha(themeColors.primary, 0.5),
                        "&:hover": {
                          borderColor: themeColors.primary,
                          backgroundColor: alpha(themeColors.primary, 0.04),
                        },
                      }),
                }}
              >
                <StackedBarChartIcon
                  sx={{ fontSize: { xs: 16, sm: 18 }, mr: { xs: 0, sm: 0.5 } }}
                />
                {!isMobile && "Stacked"}
              </Button>
            </Tooltip>
          </ButtonGroup>

          <FormControl
            size="small"
            sx={{ minWidth: { xs: "120px", sm: "150px" } }}
          >
            <Select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              displayEmpty
              variant="outlined"
              sx={{
                height: 40,
                backgroundColor: alpha(theme.palette.background.paper, 0.9),
                borderRadius: "8px",
                boxShadow: "0 2px 5px rgba(0,0,0,0.08)",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: alpha(themeColors.primary, 0.3),
                  transition: "all 0.2s ease",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: themeColors.primary,
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: themeColors.primary,
                  borderWidth: "1px",
                },
                "& .MuiSelect-icon": {
                  color: alpha(themeColors.primary, 0.8),
                },
              }}
            >
              <MenuItem value="daily">Today</MenuItem>
              <MenuItem value="weekly">Last 7 days</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
              <MenuItem value="yearly">Yearly</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {chartData.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Card
            variant="outlined"
            sx={{
              p: { xs: 2, md: 3 },
              borderRadius: 3,
              backgroundColor: alpha(theme.palette.background.paper, 0.8),
              backdropFilter: "blur(10px)",
              borderColor: alpha(themeColors.primary, 0.1),
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              "&:hover": {
                transform: "translateY(-3px)",
                boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
              },
            }}
          >
            <Stack
              direction={{ xs: "column", md: "row" }}
              divider={
                <Divider
                  orientation={{ xs: "horizontal", md: "vertical" }}
                  flexItem
                />
              }
              spacing={{ xs: 3, md: 3 }}
              justifyContent="space-between"
            >
              <Box
                sx={{
                  flex: 1,
                  position: "relative",
                  "&::after": isTablet
                    ? {}
                    : {
                        content: '""',
                        position: "absolute",
                        bottom: "-16px",
                        left: "0",
                        width: "40%",
                        height: "4px",
                        borderRadius: "2px",
                        background:
                          "linear-gradient(90deg, #4CAF50, transparent)",
                      },
                }}
              >
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Total Revenue
                </Typography>
                <Typography
                  variant="h4"
                  fontWeight="700"
                  sx={{
                    fontSize: { xs: "1.75rem", sm: "2rem" },
                    textShadow: "0 2px 4px rgba(0,0,0,0.05)",
                    color: themeColors.primary,
                  }}
                >
                  {currencyFormatter(totalRevenue)}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mt: 1.5,
                    gap: 1.5,
                    flexWrap: "wrap",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.8,
                      backgroundColor: alpha("#4CAF50", 0.1),
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 2,
                      transition: "all 0.2s ease",
                      "&:hover": {
                        backgroundColor: alpha("#4CAF50", 0.2),
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        backgroundColor: "#4CAF50",
                      }}
                    />
                    <Typography
                      variant="caption"
                      fontWeight="500"
                      color="#4CAF50"
                    >
                      {currencyFormatter(totalCashRevenue)}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.8,
                      backgroundColor: alpha("#2196F3", 0.1),
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 2,
                      transition: "all 0.2s ease",
                      "&:hover": {
                        backgroundColor: alpha("#2196F3", 0.2),
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        backgroundColor: "#2196F3",
                      }}
                    />
                    <Typography
                      variant="caption"
                      fontWeight="500"
                      color="#2196F3"
                    >
                      {currencyFormatter(totalOnlineRevenue)}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Box
                sx={{
                  flex: 1,
                  position: "relative",
                  "&::after": isTablet
                    ? {}
                    : {
                        content: '""',
                        position: "absolute",
                        bottom: "-16px",
                        left: "0",
                        width: "40%",
                        height: "4px",
                        borderRadius: "2px",
                        background: `linear-gradient(90deg, ${themeColors.secondary}, transparent)`,
                      },
                }}
              >
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Total Orders
                </Typography>
                <Typography
                  variant="h4"
                  fontWeight="700"
                  sx={{
                    fontSize: { xs: "1.75rem", sm: "2rem" },
                    textShadow: "0 2px 4px rgba(0,0,0,0.05)",
                    color: themeColors.secondary,
                  }}
                >
                  {totalOrders}
                </Typography>
                <Chip
                  size="small"
                  label={`Avg. ${currencyFormatter(
                    totalOrders ? totalRevenue / totalOrders : 0
                  )}/order`}
                  sx={{
                    mt: 1.5,
                    backgroundColor: alpha(themeColors.secondary, 0.15),
                    color: themeColors.primary,
                    fontWeight: 500,
                    py: 0.5,
                    borderRadius: "8px",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: alpha(themeColors.secondary, 0.25),
                    },
                  }}
                />
              </Box>

              {highestRevenuePeriod && (
                <Box
                  sx={{
                    flex: 1,
                    position: "relative",
                    "&::after": isTablet
                      ? {}
                      : {
                          content: '""',
                          position: "absolute",
                          bottom: "-16px",
                          left: "0",
                          width: "40%",
                          height: "4px",
                          borderRadius: "2px",
                          background: `linear-gradient(90deg, ${themeColors.primary}, transparent)`,
                        },
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Best Performing Period
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <TrendingUpIcon
                      sx={{
                        color: themeColors.primary,
                        filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.1))",
                      }}
                    />
                    <Typography
                      variant="h6"
                      fontWeight="600"
                      sx={{
                        fontSize: { xs: "1.1rem", sm: "1.25rem" },
                        textShadow: "0 1px 2px rgba(0,0,0,0.05)",
                      }}
                    >
                      {highestRevenuePeriod.period}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1.5 }}
                  >
                    {currencyFormatter(
                      highestRevenuePeriod.cashRevenue +
                        highestRevenuePeriod.onlineRevenue
                    )}
                    <Typography
                      component="span"
                      variant="caption"
                      sx={{
                        ml: 1,
                        backgroundColor: alpha(themeColors.primary, 0.1),
                        px: 1,
                        py: 0.3,
                        borderRadius: 1,
                        color: themeColors.primary,
                      }}
                    >
                      {highestRevenuePeriod.totalOrders} orders
                    </Typography>
                  </Typography>
                </Box>
              )}
            </Stack>
          </Card>
        </Box>
      )}

      <Card
        elevation={0}
        sx={{
          borderRadius: "16px",
          overflow: "hidden",
          backgroundColor: alpha(theme.palette.background.paper, 0.6),
          backdropFilter: "blur(10px)",
          border: `1px solid ${alpha(themeColors.primary, 0.1)}`,
          boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
          },
        }}
      >
        {chartData.length > 0 ? (
          <Box
            sx={{
              p: { xs: 1.5, sm: 2.5 },
              overflow: "auto",
              maxHeight: "500px",
              width: "100%",
              minWidth:
                chartData.length > 6 ? `${chartData.length * 100}px` : "100%",
              "&::-webkit-scrollbar": {
                width: "8px",
                height: "8px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: alpha(themeColors.primary, 0.2),
                borderRadius: "8px",
                "&:hover": {
                  backgroundColor: alpha(themeColors.primary, 0.3),
                },
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: alpha(theme.palette.background.paper, 0.3),
                borderRadius: "8px",
              },
            }}
          >
            <BarChart
              dataset={chartData}
              xAxis={[
                {
                  dataKey: "period",
                  scaleType: "band",
                  tickLabelStyle: {
                    angle: timeRange === "daily" ? 0 : -45,
                    textAnchor: timeRange === "daily" ? "middle" : "end",
                    fontSize: isMobile ? 10 : 12,
                  },
                  tickSize: 0,
                  tickRotation: timeRange === "daily" ? 0 : -45,
                },
              ]}
              {...getChartSettings()}
            />
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "300px",
              p: 3,
              background: `radial-gradient(circle, ${alpha(
                theme.palette.background.paper,
                0.8
              )} 0%, ${alpha(theme.palette.background.default, 0.4)} 100%)`,
            }}
          >
            <Box sx={{ textAlign: "center", maxWidth: "400px" }}>
              <QueryStatsIcon
                sx={{
                  fontSize: 70,
                  color: alpha(themeColors.primary, 0.4),
                  mb: 2,
                  animation: "pulse 2s infinite ease-in-out",
                  "@keyframes pulse": {
                    "0%": { opacity: 0.6 },
                    "50%": { opacity: 0.9 },
                    "100%": { opacity: 0.6 },
                  },
                }}
              />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No data available
              </Typography>
              <Typography variant="body2" color="text.secondary">
                There is no revenue data available for the selected time period.
                Try selecting a different time range.
              </Typography>
            </Box>
          </Box>
        )}
      </Card>
    </Card>
  );
};

export default BarChartDetails;
