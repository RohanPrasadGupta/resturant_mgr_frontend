import React from "react";
import { Box, Typography, Card, Grid } from "@mui/material";
import NepaliCurrencyIcon from "../../../icons/NepaliCurrencyIcon";

const SumChartDetails = ({ data }) => {
  return (
    <Card
      sx={{
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        padding: "20px",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
      }}
    >
      <Typography variant="h6" sx={{ marginBottom: "16px", fontWeight: 600 }}>
        Overall Summary
      </Typography>
      <Grid container spacing={3}>
        <Grid
          item
          xs={12}
          sm={4}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            textAlign: "center",
            padding: "16px",
            gap: "8px",
          }}
        >
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Total Revenue
          </Typography>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <NepaliCurrencyIcon fontSize={35} />
            {data.totalAmount.toLocaleString()}
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
          sm={4}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            textAlign: "center",
            padding: "16px",
            gap: "8px",
          }}
        >
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Total Orders
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {data.totalOrders}
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
          sm={4}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            textAlign: "center",
            padding: "16px",
            gap: "8px",
          }}
        >
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Average Order Value
          </Typography>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <NepaliCurrencyIcon fontSize={35} />
            <Box>{(data.totalAmount / data.totalOrders).toFixed(2)}</Box>
          </Typography>
        </Grid>
      </Grid>
    </Card>
  );
};

export default SumChartDetails;
