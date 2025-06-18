import { Box, Typography } from "@mui/material";
import React from "react";
import { BarChart, Settings } from "@mui/icons-material";

const AdminNav = ({ setSelectedTab, selectedTab }) => {
  const navItems = [
    {
      id: "visualize",
      label: "Data Visualization",
      icon: <BarChart />,
    },
    {
      id: "userSettings",
      label: "User Settings",
      icon: <Settings />,
    },
  ];

  return (
    <Box
      sx={{
        padding: { xs: "16px", md: "24px" },
        height: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "row", md: "column" },
          gap: "8px",
          overflowX: { xs: "auto", md: "visible" },
        }}
      >
        {navItems.map((item) => (
          <Box
            key={item.id}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 16px",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "all 0.2s ease-in-out",
              backgroundColor:
                selectedTab === item.id ? "#007bff" : "transparent",
              color: selectedTab === item.id ? "#fff" : "#6c757d",
              minWidth: { xs: "200px", md: "auto" },
              "&:hover": {
                backgroundColor:
                  selectedTab === item.id ? "#0056b3" : "#f8f9fa",
                color: selectedTab === item.id ? "#fff" : "#495057",
                transform: "translateX(4px)",
              },
            }}
            onClick={() => setSelectedTab(item.id)}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                fontSize: "20px",
              }}
            >
              {item.icon}
            </Box>
            <Typography
              variant="body1"
              sx={{
                fontWeight: selectedTab === item.id ? 600 : 400,
                fontSize: { xs: "0.9rem", md: "1rem" },
                whiteSpace: "nowrap",
              }}
            >
              {item.label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default AdminNav;
