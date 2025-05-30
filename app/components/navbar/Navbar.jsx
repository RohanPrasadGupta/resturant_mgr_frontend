"use client";
import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  useMediaQuery,
  useTheme,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import PersonIcon from "@mui/icons-material/Person";
import TableRestaurantIcon from "@mui/icons-material/TableRestaurant";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import styles from "./navbarStyle.module.scss";
import { useQuery } from "@tanstack/react-query";
import { useSelector, useDispatch } from "react-redux";
import {
  loginUserRedux,
  logoutUserRedux,
  updateTableNumberRedux,
} from "../../redux/storeSlice/loginUserSlice";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.selectedUser.value);

  const userType =
    userData.tableNumber ||
    (typeof window !== "undefined" &&
      localStorage.getItem("mgrUserData") &&
      JSON.parse(localStorage.getItem("mgrUserData")));

  const isCustomer =
    userType.username === "customer" || userData.username === "customer";

  const isActive = (path) => pathname === path;

  const {
    isPending,
    isError,
    data: tables,
    error,
  } = useQuery({
    queryKey: ["getTables"],
    queryFn: () =>
      fetch("https://resturant-mgr-backend.onrender.com/api/tables").then(
        (res) => res.json()
      ),
  });

  // Get table from URL parameters or localStorage
  useEffect(() => {
    const tableNumber = searchParams.get("tableNumber");
    const username = searchParams.get("username");
    if (tableNumber && username) {
      dispatch(
        loginUserRedux({ username: username, tableNumber: tableNumber })
      );
      localStorage.setItem(
        "mgrUserData",
        JSON.stringify({ username, tableNumber })
      );
    }
  }, [searchParams]);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleTableChange = (event) => {
    dispatch(updateTableNumberRedux(event.target.value));
    localStorage.setItem(
      "mgrUserData",
      JSON.stringify({
        username: userData.username,
        tableNumber: event.target.value,
      })
    );
  };

  const navItems = [
    { name: "Home", path: "/pages/home", icon: <HomeIcon /> },
    { name: "Orders", path: "/pages/order", icon: <ShoppingBagIcon /> },
  ];

  const drawer = (
    <Box
      className={styles.drawerContainer}
      onClick={(e) => e.stopPropagation()}
    >
      <List>
        {navItems.map((item) => (
          <Link href={item.path} key={item.name} className={styles.mobileLink}>
            <ListItem
              className={isActive(item.path) ? styles.activeItem : ""}
              onClick={handleDrawerToggle}
            >
              <Box className={styles.listItemContent}>
                {item.icon}
                <ListItemText
                  primary={item.name}
                  className={styles.listItemText}
                />
              </Box>
            </ListItem>
          </Link>
        ))}

        <ListItem>
          <Box className={styles.mobileTableSelect}>
            {userData && userData.username === "customer" ? (
              <div className={styles.customerName}>{userData.tableNumber}</div>
            ) : (
              <>
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel
                    id="mobile-table-select-label"
                    className={styles.tableSelectLabel}
                  >
                    Select Table
                  </InputLabel>
                  <Select
                    labelId="mobile-table-select-label"
                    value={userData.tableNumber}
                    onChange={handleTableChange}
                    label="Select Table"
                    className={styles.mobileTableSelectInput}
                    startAdornment={
                      <TableRestaurantIcon className={styles.tableIcon} />
                    }
                    disabled={isPending}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {tables &&
                      tables.map((table) => (
                        <MenuItem
                          key={table._id}
                          value={table._id}
                          disabled={table.status !== "available"}
                        >
                          {table.number}{" "}
                          {table.status !== "available" && `(${table.status})`}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
                {isPending && (
                  <CircularProgress
                    size={20}
                    className={styles.tableSelectLoader}
                  />
                )}
              </>
            )}
          </Box>
        </ListItem>

        <Divider className={styles.divider} />
        <Link href="/signin" className={styles.mobileLink}>
          <ListItem
            className={isActive("/signin") ? styles.activeItem : ""}
            onClick={handleDrawerToggle}
          >
            <Box className={styles.listItemContent}>
              <PersonIcon />
              <ListItemText primary="Sign In" className={styles.listItemText} />
            </Box>
          </ListItem>
        </Link>
      </List>
    </Box>
  );

  return (
    <AppBar position="sticky" className={styles.appBar}>
      <Toolbar className={styles.toolbar}>
        <Link href="/pages/home" className={styles.brandLink}>
          <Typography variant="h6" className={styles.brand}>
            Spice Haven
          </Typography>
        </Link>

        <Box className={styles.navSection}>
          {!isMobile && (
            <Box className={styles.tableSelectWrapper}>
              {isCustomer ? (
                // For customers, just show their table number without the dropdown
                <Box className={styles.customerTableDisplay}>
                  <TableRestaurantIcon className={styles.tableIcon} />
                  <Typography variant="body2">
                    Table:{" "}
                    {userData.tableNumber === ""
                      ? userType.tableNumber
                      : userData.tableNumber}
                  </Typography>
                </Box>
              ) : (
                // For staff/admin, show the full dropdown
                <FormControl
                  variant="outlined"
                  size="small"
                  className={styles.tableSelectContainer}
                  error={isError}
                >
                  <InputLabel
                    id="table-select-label"
                    className={styles.tableSelectLabel}
                  >
                    Table
                  </InputLabel>
                  <Select
                    labelId="table-select-label"
                    value={userData.tableNumber}
                    onChange={handleTableChange}
                    label="Table"
                    className={styles.tableSelect}
                    startAdornment={
                      <TableRestaurantIcon className={styles.tableIcon} />
                    }
                    disabled={isPending}
                  >
                    <MenuItem value="">
                      <em>Select Table</em>
                    </MenuItem>
                    {tables &&
                      tables.map((table) => (
                        <MenuItem
                          key={table._id}
                          value={table._id}
                          disabled={table.status !== "available"}
                        >
                          {table.number}{" "}
                          {table.status !== "available" && `(${table.status})`}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              )}

              {isPending && (
                <CircularProgress
                  size={20}
                  className={styles.tableSelectLoader}
                />
              )}
            </Box>
          )}

          {isMobile ? (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              className={styles.menuButton}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <Box className={styles.desktopMenu}>
              {navItems.map((item) => (
                <Link
                  href={item.path}
                  key={item.name}
                  className={styles.navLink}
                >
                  <Button
                    color="inherit"
                    className={`${styles.navButton} ${
                      isActive(item.path) ? styles.activeButton : ""
                    }`}
                    startIcon={item.icon}
                  >
                    {item.name}
                  </Button>
                </Link>
              ))}
              {isCustomer ? (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                >
                  <AccountCircleIcon />
                </Box>
              ) : (
                <Link href="/signin" className={styles.navLink}>
                  <Button
                    variant="contained"
                    color="primary"
                    className={`${styles.signInButton} ${
                      isActive("/signin") ? styles.activeSignInButton : ""
                    }`}
                    startIcon={<PersonIcon />}
                  >
                    Sign In
                  </Button>
                </Link>
              )}
            </Box>
          )}
        </Box>
      </Toolbar>

      <Drawer
        variant="temporary"
        anchor="right"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        className={styles.drawer}
        ModalProps={{
          keepMounted: true,
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
