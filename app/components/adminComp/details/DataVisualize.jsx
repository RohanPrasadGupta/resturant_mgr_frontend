import React from "react";
import { Box, Typography, Card, Grid } from "@mui/material";
import PieChartComp from "./charts/PieChartComp";
import EachDataDetails from "./charts/EachDataDetails";
import SumChartDetails from "./charts/SumChartDetails";
import BarChartDetails from "./charts/BarChartDetails";

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
    <Box
      sx={{
        padding: { xs: "16px", sm: "20px", md: "24px" },
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          gap: "20px",
        }}
      >
        <Box sx={{ marginBottom: "32px", width: "50%" }}>
          <Box sx={{ marginBottom: "24px" }}>
            <SumChartDetails data={mockData} />
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateRows: "auto",
              gridAutoColumns: "1fr",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "16px",
            }}
          >
            <Box>
              <EachDataDetails
                data={mockData.paymentBreakdown.cash}
                type="cash"
              />
            </Box>
            <Box>
              <EachDataDetails
                data={mockData.paymentBreakdown.online}
                type="online"
              />
            </Box>
          </Box>
        </Box>

        <Grid sx={{ width: "50%" }}>
          <Card
            sx={{
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              transition: "transform 0.2s ease-in-out",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
              },
            }}
          >
            <Box
              sx={{
                padding: { xs: "16px", sm: "20px" },
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <PieChartComp
                cash={mockData?.paymentBreakdown?.cash?.amount}
                online={mockData?.paymentBreakdown?.online?.amount}
                cashPercent={mockData?.paymentBreakdown?.cash?.percentage}
                onlinePercent={mockData?.paymentBreakdown?.online?.percentage}
              />
            </Box>
          </Card>
        </Grid>
      </Box>

      <Grid sx={{ width: "100%", marginTop: "32px" }}>
        <Card
          sx={{
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            transition: "transform 0.2s ease-in-out",
            height: "100%",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
            },
          }}
        >
          <BarChartDetails />
        </Card>
      </Grid>
    </Box>
  );
};

export default DataVisualize;
