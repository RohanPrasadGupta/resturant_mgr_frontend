import {
  Box,
  useTheme,
  useMediaQuery,
  alpha,
  Drawer,
  IconButton,
  Fade,
  SpeedDial,
  SpeedDialAction,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import React, { useState, useEffect } from "react";
import DataVisualize from "./details/DataVisualize";
import UserAccess from "./details/UserAccess";
import MenuItems from "./details/MenuItems";
import AllConfirmedOrders from "./details/AllConfirmedOrders";
import AdminNav from "./AdminNav";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import WidgetsIcon from "@mui/icons-material/Widgets";
import ChecklistRtlIcon from "@mui/icons-material/ChecklistRtl";

const socket = io(
  process.env.NODE_ENV === "development"
    ? `${process.env.LOCAL_BACKEND}`
    : `${process.env.PROD_BACKEDN}`
);

const AdminBody = () => {
  const [selectedTab, setSelectedTab] = useState("visualize");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    socket.emit("register-admin");

    socket.on("new-order", (order) => {
      toast.success(
        ` New order for Table ${order.tableNumber || "N/A"} received`
      );
    });

    socket.on("order-completed", (order) => {
      toast.success(
        ` Order for Table ${order.tableNumber || "N/A"} completed!`
      );
    });

    return () => {
      socket.off("new-order");
      socket.off("order-completed");
    };
  }, []);

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  };

  return (
    <Box
      sx={{
        backgroundColor:
          theme.palette.mode === "dark"
            ? alpha(theme.palette.background.default, 0.95)
            : "#f8f9fa",
        display: "flex",
        flexDirection: "column",
        minHeight: "calc(100vh - 64px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flex: 1,
          flexDirection: { xs: "column", md: "row" },
          height: "100%",
          position: "relative",
        }}
      >
        {isMobile ? (
          <SpeedDial
            ariaLabel="Admin actions"
            sx={{
              position: "fixed",
              bottom: 20,
              right: 20,
              zIndex: 1200,
            }}
            icon={<WidgetsIcon sx={{ color: "#fff" }} />}
          >
            <SpeedDialAction
              sx={{
                "& .MuiSpeedDialAction-staticTooltipLabel": {
                  whiteSpace: "nowrap",
                },
                "& .MuiSpeedDialAction-fab": {
                  background: "linear-gradient(45deg, #ff9800, #ff5722)",
                },
              }}
              icon={
                <ChecklistRtlIcon
                  sx={{
                    color: "#fff",
                  }}
                />
              }
              slotProps={{
                tooltip: {
                  open: true,
                  title: "Completed Orders",
                },
              }}
              onClick={() => handleTabChange("completedOrders")}
            />
            <SpeedDialAction
              sx={{
                "& .MuiSpeedDialAction-staticTooltipLabel": {
                  whiteSpace: "nowrap",
                },
                "& .MuiSpeedDialAction-fab": {
                  background: "linear-gradient(45deg, #ff9800, #ff5722)",
                },
              }}
              icon={
                <PeopleIcon
                  sx={{
                    color: "#fff",
                  }}
                />
              }
              slotProps={{
                tooltip: {
                  open: true,
                  title: "User Settings",
                },
              }}
              onClick={() => handleTabChange("userSettings")}
            />
            <SpeedDialAction
              sx={{
                "& .MuiSpeedDialAction-staticTooltipLabel": {
                  whiteSpace: "nowrap",
                },
                "& .MuiSpeedDialAction-fab": {
                  background: "linear-gradient(45deg, #ff9800, #ff5722)",
                },
              }}
              icon={
                <RestaurantMenuIcon
                  sx={{
                    color: "#fff",
                  }}
                />
              }
              slotProps={{
                tooltip: {
                  open: true,
                  title: "Menu Settings",
                },
              }}
              onClick={() => handleTabChange("menuItems")}
            />

            <SpeedDialAction
              sx={{
                "& .MuiSpeedDialAction-staticTooltipLabel": {
                  whiteSpace: "nowrap",
                },
                "& .MuiSpeedDialAction-fab": {
                  background: "linear-gradient(45deg, #ff9800, #ff5722)",
                },
              }}
              icon={
                <DashboardIcon
                  sx={{
                    color: "#fff",
                  }}
                />
              }
              slotProps={{
                tooltip: {
                  open: true,
                  title: "Dashboard",
                },
              }}
              onClick={() => handleTabChange("visualize")}
            />
          </SpeedDial>
        ) : (
          <Box
            sx={{
              width: "280px",
              minWidth: "280px",
              backgroundColor:
                theme.palette.mode === "dark"
                  ? theme.palette.background.paper
                  : "#fff",
              borderRight: `1px solid ${
                theme.palette.mode === "dark"
                  ? alpha(theme.palette.divider, 0.6)
                  : "#e9ecef"
              }`,
              transition: "all 0.3s ease",
              position: "sticky",
              top: 0,
              height: "calc(100vh - 64px)",
              overflowY: "auto",
              overflowX: "hidden",
              "&::-webkit-scrollbar": {
                width: "6px",
                backgroundColor: "transparent",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: alpha(theme.palette.primary.main, 0.2),
                borderRadius: "6px",
                "&:hover": {
                  backgroundColor: alpha(theme.palette.primary.main, 0.3),
                },
              },
              zIndex: 10,
            }}
          >
            <AdminNav
              setSelectedTab={handleTabChange}
              selectedTab={selectedTab}
            />
          </Box>
        )}

        <Box
          component="main"
          sx={{
            flex: 1,
            padding: {
              xs: "16px",
              sm: "20px",
              md: "24px",
            },
            backgroundColor:
              theme.palette.mode === "dark"
                ? alpha(theme.palette.background.default, 0.7)
                : "#f8f9fa",
            height: "calc(100vh - 64px)",
            overflow: "auto",
            transition: "all 0.3s ease",
            "&::-webkit-scrollbar": {
              width: "8px",
              backgroundColor: "transparent",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: alpha(theme.palette.primary.main, 0.2),
              borderRadius: "8px",
              "&:hover": {
                backgroundColor: alpha(theme.palette.primary.main, 0.3),
              },
            },
            scrollbarWidth: "thin",
            scrollbarColor: `${alpha(
              theme.palette.primary.main,
              0.2
            )} transparent`,
          }}
        >
          <Fade in={true} timeout={800}>
            <Box>
              {selectedTab === "visualize" && <DataVisualize />}
              {selectedTab === "userSettings" && <UserAccess />}
              {selectedTab === "menuItems" && <MenuItems />}
              {selectedTab === "completedOrders" && <AllConfirmedOrders />}
            </Box>
          </Fade>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminBody;
