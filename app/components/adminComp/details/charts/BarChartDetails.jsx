import * as React from "react";
import {
  Box,
  Typography,
  Card,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { MOCK_BAR_CHART_DATA } from "./constant";

const BarChartDetails = () => {
  const [timeRange, setTimeRange] = React.useState("monthly");

  // Function to get date range based on selection
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

  // Function to process data based on selected time range
  const processDataByTimeRange = (data, range) => {
    const rangeConfig = getDateRange(range);
    const groupedData = {};
    const orders = data[0]?.finalOrders || [];

    // Filter orders within date range
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
          totalOrders: 0,
        };
      }

      groupedData[key].totalOrders += 1;
      if (order.paymentMethod === "cash") {
        groupedData[key].cashRevenue += order.total;
      } else {
        groupedData[key].onlineRevenue += order.total;
      }
    });

    // Convert to array and sort
    return Object.values(groupedData).sort((a, b) => {
      if (rangeConfig.groupBy === "hour") {
        return a.period.localeCompare(b.period);
      }
      return new Date(a.period) - new Date(b.period);
    });
  };

  // Process the data based on selected time range
  const chartData = processDataByTimeRange(MOCK_BAR_CHART_DATA, timeRange);

  // Currency formatter for Nepali Rupees
  const currencyFormatter = (value) => `Rs. ${value.toLocaleString()}`;

  // Dynamic chart settings based on time range
  const getChartSettings = () => {
    const baseHeight = Math.max(400, chartData.length * 40);
    return {
      yAxis: [
        {
          label: "Revenue (NPR)",
          width: 80,
        },
      ],
      series: [
        {
          dataKey: "cashRevenue",
          label: "Cash Revenue",
          valueFormatter: currencyFormatter,
          color: "#4caf50",
        },
        {
          dataKey: "onlineRevenue",
          label: "Online Revenue",
          valueFormatter: currencyFormatter,
          color: "#ff9800",
        },
      ],
      height: Math.min(baseHeight, 600),
      margin: { top: 20, bottom: 60, left: 80, right: 20 },
    };
  };

  const getTitle = () => {
    const titles = {
      daily: "Today's Hourly Revenue",
      weekly: "Last 7 Days Revenue",
      monthly: "Monthly Revenue Analysis",
      yearly: "Yearly Revenue Comparison",
    };
    return titles[timeRange];
  };

  return (
    <Card
      sx={{
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        padding: "24px",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      }}
    >
      {/* Header with Dropdown */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            color: "#333",
          }}
        >
          {getTitle()}
        </Typography>

        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Time Range</InputLabel>
          <Select
            value={timeRange}
            label="Time Range"
            onChange={(e) => setTimeRange(e.target.value)}
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              borderRadius: "8px",
            }}
          >
            <MenuItem value="daily">Daily (Today)</MenuItem>
            <MenuItem value="weekly">Weekly (7 days)</MenuItem>
            <MenuItem value="monthly">Monthly</MenuItem>
            <MenuItem value="yearly">Yearly</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Summary Stats */}
      {chartData.length > 0 && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          {chartData.map((periodData, index) => (
            <Card
              key={index}
              sx={{
                padding: "16px",
                textAlign: "center",
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                borderRadius: "8px",
              }}
            >
              <Typography variant="body2" color="text.secondary">
                {periodData.period}
              </Typography>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}
              >
                <Box>
                  <Typography variant="caption" sx={{ color: "#4caf50" }}>
                    Cash
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: 600, color: "#4caf50" }}
                  >
                    {currencyFormatter(periodData.cashRevenue)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: "#ff9800" }}>
                    Online
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: 600, color: "#ff9800" }}
                  >
                    {currencyFormatter(periodData.onlineRevenue)}
                  </Typography>
                </Box>
              </Box>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 1, display: "block" }}
              >
                {periodData.totalOrders} orders
              </Typography>
            </Card>
          ))}
        </Box>
      )}

      {/* Bar Chart */}
      <Box
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          borderRadius: "12px",
          padding: "16px",
        }}
      >
        {chartData.length > 0 ? (
          <BarChart
            dataset={chartData}
            xAxis={[
              {
                dataKey: "period",
                scaleType: "band",
                tickLabelStyle: {
                  angle: timeRange === "daily" ? 0 : -45,
                  textAnchor: timeRange === "daily" ? "middle" : "end",
                },
              },
            ]}
            {...getChartSettings()}
          />
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "300px",
              color: "text.secondary",
            }}
          >
            <Typography variant="h6">
              No data available for the selected time range
            </Typography>
          </Box>
        )}
      </Box>
    </Card>
  );
};

export default BarChartDetails;
