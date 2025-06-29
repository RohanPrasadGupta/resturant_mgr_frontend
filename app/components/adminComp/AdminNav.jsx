import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery,
  Tooltip,
  Avatar,
} from "@mui/material";
import {
  BarChart,
  Settings,
  Menu as MenuIcon,
  Dashboard,
  People,
  Restaurant,
  Notifications,
  ExpandMore,
  ExpandLess,
  Brightness4,
} from "@mui/icons-material";

const AdminNav = ({ setSelectedTab, selectedTab }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const navItems = [
    {
      id: "visualize",
      label: "Dashboard",
      icon: <Dashboard />,
    },
    {
      id: "userSettings",
      label: "User Settings",
      icon: <Settings />,
    },
    {
      id: "orders",
      label: "Orders",
      icon: <Restaurant />,
      disabled: true,
    },
    {
      id: "customers",
      label: "Customers",
      icon: <People />,
      disabled: true,
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: <Notifications />,
      disabled: true,
    },
  ];

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleNavClick = (itemId) => {
    setSelectedTab(itemId);
    if (isMobile) {
      setDrawerOpen(false);
    }
  };

  const renderNavItems = () => (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 20px",
          borderBottom: `1px solid ${theme.palette.divider}`,
          background:
            theme.palette.mode === "dark"
              ? "linear-gradient(135deg, rgba(66, 66, 66, 0.8), rgba(33, 33, 33, 0.8))"
              : "linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(245, 245, 245, 0.8))",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Avatar
            sx={{
              width: 40,
              height: 40,
              background: "linear-gradient(90deg, #ff5722, #ff9800)",
              boxShadow: "0 3px 6px rgba(255, 87, 34, 0.2)",
            }}
          >
            R
          </Avatar>
          <Box>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: "bold",
                color: "text.primary",
              }}
            >
              Restaurant Manager
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Admin Panel
            </Typography>
          </Box>
        </Box>
        {isMobile && (
          <IconButton
            onClick={toggleDrawer(false)}
            edge="end"
            sx={{
              color: "#ff5722",
              "&:hover": {
                backgroundColor: "rgba(255, 87, 34, 0.08)",
              },
            }}
          >
            {theme.direction === "rtl" ? <ExpandMore /> : <ExpandLess />}
          </IconButton>
        )}
      </Box>

      <List sx={{ padding: "12px" }}>
        {navItems.map((item) => {
          const isSelected = selectedTab === item.id;
          return (
            <ListItem
              key={item.id}
              disablePadding
              sx={{
                mb: 1,
                borderRadius: "10px",
                overflow: "hidden",
                background: isSelected
                  ? "linear-gradient(90deg, #ff5722, #ff9800)"
                  : "transparent",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: isSelected
                    ? undefined // Keep gradient when selected
                    : theme.palette.action.hover,
                  boxShadow: isSelected
                    ? "0 4px 10px rgba(255, 87, 34, 0.3)"
                    : "none",
                },
                boxShadow: isSelected
                  ? "0 4px 8px rgba(255, 87, 34, 0.2)"
                  : "none",
              }}
            >
              <Tooltip
                title={item.disabled ? "Coming soon" : ""}
                placement="right"
              >
                <Box
                  onClick={() => !item.disabled && handleNavClick(item.id)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    padding: "10px 16px",
                    opacity: item.disabled ? 0.5 : 1,
                    cursor: item.disabled ? "default" : "pointer",
                    transition: "all 0.2s",
                    "&:hover": {
                      transform: !item.disabled ? "translateX(4px)" : "none",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 40,
                      color: isSelected
                        ? "#fff"
                        : item.disabled
                        ? theme.palette.text.disabled
                        : "#ff5722", // Theme color for non-selected icons
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    sx={{
                      color: isSelected ? "#fff" : theme.palette.text.primary,
                      "& .MuiTypography-root": {
                        fontWeight: isSelected ? 600 : 500,
                      },
                    }}
                  />
                </Box>
              </Tooltip>
            </ListItem>
          );
        })}
      </List>

      <Box sx={{ flexGrow: 1 }} />

      <Box
        sx={{
          padding: "16px",
          mt: "auto",
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "10px",
            borderRadius: "10px",
            backgroundColor: theme.palette.background.paper,
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Brightness4
              fontSize="small"
              sx={{ color: "#ff9800" }} // Theme color for footer icon
            />
            <Typography
              variant="body2"
              sx={{
                background: "linear-gradient(90deg, #ff5722, #ff9800)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: 500,
              }}
            >
              v1.0.0
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  );

  return (
    <>
      {isMobile ? (
        <>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "16px",
              borderBottom: `1px solid ${theme.palette.divider}`,
              background:
                theme.palette.mode === "dark"
                  ? "linear-gradient(to right, rgba(33, 33, 33, 0.95), rgba(66, 66, 66, 0.95))"
                  : "linear-gradient(to right, rgba(255, 255, 255, 0.95), rgba(245, 245, 245, 0.95))",
            }}
          >
            <Typography
              variant="h6"
              fontWeight={600}
              sx={{
                background: "linear-gradient(90deg, #ff5722, #ff9800)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Admin Panel
            </Typography>
            <IconButton
              aria-label="open drawer"
              edge="start"
              onClick={toggleDrawer(true)}
              sx={{
                color: "#ff5722",
                "&:hover": {
                  backgroundColor: "rgba(255, 87, 34, 0.08)",
                },
              }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
          <Drawer
            anchor="left"
            open={drawerOpen}
            onClose={toggleDrawer(false)}
            sx={{
              "& .MuiDrawer-paper": {
                width: 280,
                boxSizing: "border-box",
                borderRadius: { xs: "0 16px 16px 0", md: 0 },
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
              },
            }}
          >
            <Box
              sx={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
              {renderNavItems()}
            </Box>
          </Drawer>
        </>
      ) : (
        <Box
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 0 20px rgba(0, 0, 0, 0.05)",
            background:
              theme.palette.mode === "dark"
                ? "linear-gradient(180deg, rgba(33, 33, 33, 0.98), rgba(28, 28, 28, 0.95))"
                : "linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(250, 250, 250, 0.95))",
          }}
        >
          {renderNavItems()}
        </Box>
      )}
    </>
  );
};

export default AdminNav;
