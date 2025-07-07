import {
  Box,
  useTheme,
  useMediaQuery,
  alpha,
  Drawer,
  IconButton,
  Fade,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import DataVisualize from "./details/DataVisualize";
import UserAccess from "./details/UserAccess";
import MenuItems from "./details/MenuItems";
import AdminNav from "./AdminNav";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { io } from "socket.io-client";
import toast from "react-hot-toast";

const socket = io(
  process.env.NODE_ENV === "development"
    ? `${process.env.LOCAL_BACKEND}`
    : `${process.env.PROD_BACKEDN}`
);

const AdminBody = () => {
  const [selectedTab, setSelectedTab] = useState("visualize");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [navOpen, setNavOpen] = useState(!isMobile);
  const [contentInView, setContentInView] = useState(true);

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

  useEffect(() => {
    setNavOpen(!isMobile);
  }, [isMobile]);

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
    if (isMobile) {
      setNavOpen(false);
    }
  };
  const toggleNav = () => {
    setNavOpen(!navOpen);
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
      {isMobile && (
        <Box
          sx={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            zIndex: 1200,
            transition: "all 0.3s ease",
          }}
        >
          <IconButton
            onClick={toggleNav}
            size="large"
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: "white",
              boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
              "&:hover": {
                backgroundColor: theme.palette.primary.dark,
              },
              transition: "all 0.2s ease",
              transform: navOpen && isMobile ? "rotate(90deg)" : "rotate(0deg)",
            }}
          >
            {navOpen && isMobile ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
        </Box>
      )}

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
          <Drawer
            variant="temporary"
            open={navOpen}
            onClose={() => setNavOpen(false)}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              "& .MuiDrawer-paper": {
                width: "280px",
                boxSizing: "border-box",
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? theme.palette.background.paper
                    : "#fff",
                backgroundImage:
                  theme.palette.mode === "dark"
                    ? "linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))"
                    : "none",
                boxShadow: "0 0 20px rgba(0,0,0,0.1)",
                zIndex: 1100,
                border: "none",
              },
              zIndex: 1100,
            }}
          >
            <AdminNav
              setSelectedTab={handleTabChange}
              selectedTab={selectedTab}
              isMobileDrawer={true}
            />
          </Drawer>
        ) : (
          <Box
            sx={{
              width: { xs: "100%", md: navOpen ? "280px" : "0px" },
              minWidth: { md: navOpen ? "280px" : "0px" },
              backgroundColor:
                theme.palette.mode === "dark"
                  ? theme.palette.background.paper
                  : "#fff",
              borderRight: navOpen
                ? `1px solid ${
                    theme.palette.mode === "dark"
                      ? alpha(theme.palette.divider, 0.6)
                      : "#e9ecef"
                  }`
                : "none",
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
            {navOpen && (
              <AdminNav
                setSelectedTab={handleTabChange}
                selectedTab={selectedTab}
              />
            )}
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
            </Box>
          </Fade>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminBody;
