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
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Avatar
            sx={{
              width: 40,
              height: 40,
              bgcolor: theme.palette.primary.main,
            }}
          >
            R
          </Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight={600}>
              Restaurant Manager
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Admin Panel
            </Typography>
          </Box>
        </Box>
        {isMobile && (
          <IconButton onClick={toggleDrawer(false)} edge="end">
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
                backgroundColor: isSelected
                  ? theme.palette.primary.main
                  : "transparent",
                "&:hover": {
                  backgroundColor: isSelected
                    ? theme.palette.primary.dark
                    : theme.palette.action.hover,
                },
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
                      color: isSelected ? "#fff" : theme.palette.text.primary,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    sx={{
                      color: isSelected ? "#fff" : theme.palette.text.primary,
                      "& .MuiTypography-root": {
                        fontWeight: isSelected ? 600 : 400,
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
            <Brightness4 fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
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
            }}
          >
            <Typography variant="h6" fontWeight={600}>
              Admin Panel
            </Typography>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={toggleDrawer(true)}
              sx={{ mr: 2 }}
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
          }}
        >
          {renderNavItems()}
        </Box>
      )}
    </>
  );
};

export default AdminNav;
