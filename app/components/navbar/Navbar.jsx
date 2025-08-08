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
  CircularProgress,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import PersonIcon from "@mui/icons-material/Person";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
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
import SignIn from "../signIn/SignIn";
import Modal from "@mui/material/Modal";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [signInClicked, setSignInClicked] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.selectedUser.value);
  const router = useRouter();

  const isCustomer = userData?.username === "customer";

  const isStaff =
    userData?.username === "staff" || userData?.username === "admin";

  const isAdmin = userData?.username === "admin";

  const isActive = (path) => pathname === path;

  const {
    isLoading,
    isError,
    data: tables,
    error,
  } = useQuery({
    queryKey: ["getTables"],
    queryFn: () =>
      fetch(
        process.env.NODE_ENV === "development"
          ? `${process.env.LOCAL_BACKEND}/api/tables`
          : `${process.env.PROD_BACKEDN}/api/tables`,
        {
          method: "GET",
          credentials: "include",
        }
      ).then((res) => res.json()),
    enabled: isStaff,
  });

  const { mutate: logoutUser, isPending: isLogoutLoading } = useMutation({
    mutationFn: () =>
      fetch(
        process.env.NODE_ENV === "development"
          ? `${process.env.LOCAL_BACKEND}/api/users/logout`
          : `${process.env.PROD_BACKEDN}/api/users/logout`,
        {
          method: "POST",
          credentials: "include",
        }
      ).then((res) => res.json()),
    onSuccess: () => {
      dispatch(logoutUserRedux());
      setLogoutDialogOpen(false);
      toast.success("Successfully logged out");
      // window.location.reload();
    },
    onError: () => {
      toast.error("Logout failed.");
    },
  });

  useEffect(() => {
    const tableNumber = searchParams.get("tableNumber");
    const username = searchParams.get("username");
    if (tableNumber && username) {
      dispatch(
        loginUserRedux({ username: username, tableNumber: tableNumber })
      );
    }
  }, [searchParams, dispatch]);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleTableChange = (event) => {
    dispatch(updateTableNumberRedux(event.target.value));
  };

  const handleClose = () => {
    setSignInClicked(false);
  };

  const handleLogoutClick = () => {
    setLogoutDialogOpen(true);
  };

  const handleCancelLogout = () => {
    setLogoutDialogOpen(false);
  };

  const handleConfirmLogout = () => {
    logoutUser();
  };

  const navItems = [
    { name: "Home", path: "/pages/home", icon: <HomeIcon />, showBtn: true },
    {
      name: "Orders",
      path: isStaff ? "/pages/allOrder" : "/pages/order",
      icon: <ShoppingBagIcon />,
      showBtn: true,
    },
    {
      name: "Admin",
      path: isAdmin ? "/pages/admin" : "/pages/home",
      icon: <AdminPanelSettingsIcon />,
      showBtn: isAdmin ? true : false,
    },
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
                    disabled={isLoading}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {Array.isArray(tables) && isStaff
                      ? tables.map((table) => (
                          <MenuItem
                            key={table._id}
                            value={table._id}
                            disabled={table.status !== "available"}
                          >
                            {table.number}{" "}
                            {table.status !== "available" && (
                              <FiberManualRecordIcon
                                sx={{
                                  color: "green",
                                  fontSize: 12,
                                  ml: 0.5,
                                }}
                              />
                            )}
                          </MenuItem>
                        ))
                      : null}
                  </Select>
                </FormControl>
                {isLoading && (
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
            onClick={() => setSignInClicked(true)}
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
    <>
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
                  <Box className={styles.customerTableDisplay}>
                    <TableRestaurantIcon className={styles.tableIcon} />
                    <Typography variant="body2">
                      Table: {userData.tableNumber || "Not selected"}
                    </Typography>
                  </Box>
                ) : (
                  <>
                    {isStaff && tables?.length > 0 && (
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
                          disabled={isLoading}
                        >
                          <MenuItem value="">
                            <em>Select Table</em>
                          </MenuItem>
                          {Array.isArray(tables) && isStaff
                            ? tables.map((table) => (
                                <MenuItem key={table._id} value={table.number}>
                                  {table.number}{" "}
                                  {table.status !== "available" && (
                                    <FiberManualRecordIcon
                                      sx={{
                                        color: "green",
                                        fontSize: 12,
                                        ml: 0.5,
                                      }}
                                    />
                                  )}
                                </MenuItem>
                              ))
                            : null}
                        </Select>
                      </FormControl>
                    )}
                  </>
                )}

                {isLoading && (
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
                      sx={{ display: item.showBtn ? "inline-flex" : "none" }}
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
                  <>
                    {isStaff ? (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          cursor: "pointer",
                        }}
                        onClick={handleLogoutClick}
                      >
                        <AccountCircleIcon />
                      </Box>
                    ) : (
                      <Button
                        variant="contained"
                        color="primary"
                        className={`${styles.signInButton} ${
                          isActive("/signin") ? styles.activeSignInButton : ""
                        }`}
                        startIcon={<PersonIcon />}
                        onClick={() => setSignInClicked(true)}
                      >
                        Sign In
                      </Button>
                    )}
                  </>
                )}
              </Box>
            )}
          </Box>
        </Toolbar>

        <Dialog
          open={logoutDialogOpen}
          onClose={handleCancelLogout}
          aria-labelledby="logout-dialog-title"
          aria-describedby="logout-dialog-description"
        >
          <DialogContent>
            <DialogContentText id="logout-dialog-description">
              Are you sure you want to log out?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelLogout} color="primary">
              Cancel
            </Button>
            <Button
              onClick={handleConfirmLogout}
              color="primary"
              variant="contained"
              autoFocus
              sx={{
                backgroundColor: "#ff9800",
              }}
            >
              Logout
            </Button>
          </DialogActions>
        </Dialog>

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
      {signInClicked && (
        <Modal
          open={signInClicked}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box>
            <SignIn handleClose={handleClose} />
          </Box>
        </Modal>
      )}
    </>
  );
};

export default Navbar;
