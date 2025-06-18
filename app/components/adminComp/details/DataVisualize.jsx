import React from "react";
import { Box, Typography, Card, Grid } from "@mui/material";
import PieChartComp from "./charts/PieChartComp";
import EachDataDetails from "./charts/EachDataDetails";
import SumChartDetails from "./charts/SumChartDetails";

const DataVisualize = () => {
  const mockData = {
    totalAmount: 50040,
    cashAmount: 47040,
    onlineAmount: 3000,
    totalOrders: 9,
    cashOrders: 7,
    onlineOrders: 2,
    paymentBreakdown: {
      cash: {
        amount: 47040,
        orders: 7,
        percentage: "94.00",
      },
      online: {
        amount: 3000,
        orders: 2,
        percentage: "6.00",
      },
    },
  };

  return (
    <Box>
      <Grid container spacing={3}>
        <Card
          sx={{
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            transition: "transform 0.2s ease-in-out",
            height: "100%",
          }}
        >
          <Box sx={{ padding: "20px" }}>
            <PieChartComp
              cash={mockData?.paymentBreakdown?.cash?.amount}
              online={mockData?.paymentBreakdown?.online?.amount}
              cashPercent={mockData?.paymentBreakdown?.cash?.percentage}
              onlinePercent={mockData?.paymentBreakdown?.online?.percentage}
            />
          </Box>
        </Card>

        <Grid item xs={12}>
          <SumChartDetails data={mockData} />

          <Box sx={{ marginTop: "20px" }}>
            <EachDataDetails
              data={mockData.paymentBreakdown.cash}
              type="cash"
            />
            <EachDataDetails
              data={mockData.paymentBreakdown.online}
              type="online"
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DataVisualize;
