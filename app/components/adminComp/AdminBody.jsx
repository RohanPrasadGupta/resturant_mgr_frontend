import { Box } from "@mui/material";
import React, { useState } from "react";
import HeaderTittle from "../Headings/HeaderTittle";
import DataVisualize from "./details/DataVisualize";
import UserAccess from "./details/UserAccess";
import AdminNav from "./AdminNav";

const AdminBody = () => {
  const [selectedTab, setSelectedTab] = useState("visualize");

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          padding: { xs: "16px", md: "24px" },
          borderBottom: "1px solid #e9ecef",
          backgroundColor: "#fff",
          position: "sticky",
          top: 0,
          zIndex: 1000,
        }}
      >
        <HeaderTittle title="Admin Dashboard" />
      </Box>

      <Box
        sx={{
          display: "flex",
          flex: 1,
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        <Box
          sx={{
            width: { xs: "100%", md: "280px" },
            minWidth: { md: "280px" },
            backgroundColor: "#fff",
            borderRight: { md: "1px solid #e9ecef" },
            borderBottom: { xs: "1px solid #e9ecef", md: "none" },
          }}
        >
          <AdminNav setSelectedTab={setSelectedTab} selectedTab={selectedTab} />
        </Box>

        <Box
          sx={{
            flex: 1,
            padding: { xs: "16px", md: "24px" },
            backgroundColor: "#f8f9fa",
            overflow: "auto",
          }}
        >
          {selectedTab === "visualize" && <DataVisualize />}
          {selectedTab === "userSettings" && <UserAccess />}
        </Box>
      </Box>
    </Box>
  );
};

export default AdminBody;
