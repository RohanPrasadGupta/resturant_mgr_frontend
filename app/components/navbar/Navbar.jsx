"use client";
import React, { useEffect, useState, useContext } from "react";
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
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
import LogoutIcon from "@mui/icons-material/Logout";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { ColorModeContext } from "../../theme/ColorModeContext";
import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificationsBox from "../../components/notificaitons/NotificationsBox";
import ClickAwayListener from "@mui/material/ClickAwayListener";

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [signInClicked, setSignInClicked] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.selectedUser.value);
  const router = useRouter();
  const queryClient = useQueryClient();
  const colorMode = useContext(ColorModeContext);

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
    const newTable = event.target.value;
    dispatch(updateTableNumberRedux(newTable));
    // Persist updated table number alongside existing stored user data
    try {
      if (typeof window !== "undefined") {
        const existing = JSON.parse(
          localStorage.getItem("mgrUserData") || "{}"
        );
        localStorage.setItem(
          "mgrUserData",
          JSON.stringify({ ...existing, tableNumber: newTable })
        );
      }
    } catch (e) {
      console.warn("Failed to persist tableNumber", e);
    }
    // Invalidate any table-related queries so dependent components refetch
    queryClient.invalidateQueries({ queryKey: ["fetchTableData"] });
    queryClient.invalidateQueries({ queryKey: ["currentOrder"] });
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

  const handleNotificationClick = () => {
    setNotificationOpen((prev) => !prev);
  };

  const handleCloseNotification = () => {
    setNotificationOpen(false);
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
      sx={{
        background: isMobile
          ? "none"
          : "linear-gradient(135deg, #ff5722, #ff9800)",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "12px 16px",
        }}
      >
        {isStaff ? (
          <Button
            variant="contained"
            color="primary"
            className={`${styles.signInButton} `}
            startIcon={<PersonIcon />}
            onClick={handleLogoutClick}
          >
            Log Out
          </Button>
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
      </Box>
      <List>
        <Link href="/pages/home" className={styles.mobileLink}>
          <ListItem
            className={isActive("/pages/home") ? styles.activeItem : ""}
            onClick={handleDrawerToggle}
          >
            <Box className={styles.listItemContent}>
              <HomeIcon />
              <ListItemText primary="Home" className={styles.listItemText} />
            </Box>
          </ListItem>
        </Link>

        {userData?.username && (
          <Link
            href={isStaff ? "/pages/allOrder" : "/pages/order"}
            className={styles.mobileLink}
          >
            <ListItem
              className={
                isActive(isStaff ? "/pages/allOrder" : "/pages/order")
                  ? styles.activeItem
                  : ""
              }
              onClick={handleDrawerToggle}
            >
              <Box className={styles.listItemContent}>
                <ShoppingBagIcon />
                <ListItemText
                  primary="Orders"
                  className={styles.listItemText}
                />
              </Box>
            </ListItem>
          </Link>
        )}

        {isAdmin && (
          <Link href="/pages/admin" className={styles.mobileLink}>
            <ListItem
              className={isActive("/pages/admin") ? styles.activeItem : ""}
              onClick={handleDrawerToggle}
            >
              <Box className={styles.listItemContent}>
                <AdminPanelSettingsIcon />
                <ListItemText primary="Admin" className={styles.listItemText} />
              </Box>
            </ListItem>
          </Link>
        )}

        <ListItem>
          <Box className={styles.mobileTableSelect}>
            {userData && userData.username === "customer" ? (
              <div className={styles.customerName}>{userData.tableNumber}</div>
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
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="sticky"
        color="transparent"
        elevation={0}
        className={styles.appBar}
        sx={{ boxShadow: "none" }}
      >
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
                                  {/* {table.status !== "available" && (
                                    <FiberManualRecordIcon
                                      sx={{
                                        color: "green",
                                        fontSize: 12,
                                        ml: 0.5,
                                      }}
                                    />
                                  )} */}
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
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  className={styles.menuButton}
                >
                  <MenuIcon />
                </IconButton>
              </Box>
            ) : (
              <Box className={styles.desktopMenu}>
                <Box className={styles.navButtonsCluster}>
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
                  <IconButton
                    onClick={colorMode.toggleColorMode}
                    aria-label="toggle light/dark mode"
                    className={styles.modeToggle}
                    size="large"
                  >
                    {theme.palette.mode === "dark" ? (
                      <LightModeIcon />
                    ) : (
                      <DarkModeIcon />
                    )}
                  </IconButton>

                  {isAdmin && (
                    <Box
                      sx={{
                        mt: "auto",
                        p: 2,
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <IconButton
                        onClick={handleNotificationClick}
                        size="large"
                        sx={{
                          backgroundColor: theme.palette.primary.main,
                          color: "#fff",
                          "&:hover": {
                            backgroundColor: theme.palette.primary.dark,
                          },
                        }}
                      >
                        <NotificationsIcon />
                      </IconButton>
                    </Box>
                  )}
                </Box>

                {isCustomer ? (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                  >
                    <AccountCircleIcon
                      sx={{
                        color:
                          theme.palette.mode === "light" ? "#fff" : "inherit",
                      }}
                    />
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
                        <IconButton
                          aria-label="Account / Logout"
                          size="large"
                          sx={{
                            color:
                              theme.palette.mode === "light"
                                ? "#fff"
                                : "inherit",
                          }}
                          onClick={handleLogoutClick}
                        >
                          <AccountCircleIcon
                            sx={{
                              color:
                                theme.palette.mode === "light"
                                  ? "#fff"
                                  : "inherit",
                            }}
                          />
                        </IconButton>
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
          <DialogActions
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Button
              onClick={handleCancelLogout}
              color="warning"
              sx={{
                width: "120px",
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmLogout}
              color="primary"
              variant="contained"
              autoFocus
              disabled={isLogoutLoading}
              sx={{
                background: "linear-gradient(45deg, #ff9800, #ff5722)",
                color: "#fff",
                width: "140px",
                fontWeight: 600,
                boxShadow: "0 2px 8px rgba(255,87,34,0.12)",
                display: "flex",
                alignItems: "center",
                gap: 1,
                justifyContent: "center",
                "&:hover": {
                  background:
                    "linear-gradient(45deg, #ff9800 80%, #ff5722 100%)",
                  color: "#fff",
                },
                "&.Mui-disabled": {
                  opacity: 0.7,
                  background: "linear-gradient(45deg, #ff9800, #ff5722)",
                  color: "#fff",
                },
              }}
            >
              {isLogoutLoading ? (
                <CircularProgress size={18} sx={{ color: "#fff" }} />
              ) : (
                <LogoutIcon sx={{ fontSize: 22 }} />
              )}
              {isLogoutLoading ? "Logging out" : "Logout"}
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
          <Box
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              background: "linear-gradient(45deg, #ff9800, #ff5722)",
            }}
          >
            {drawer}

            <Box
              sx={{
                mt: "auto",
                p: 2,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <IconButton
                onClick={colorMode.toggleColorMode}
                aria-label="toggle light/dark mode"
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: theme.palette.primary.dark,
                  },
                }}
              >
                {theme.palette.mode === "dark" ? (
                  <LightModeIcon />
                ) : (
                  <DarkModeIcon />
                )}
              </IconButton>
            </Box>
          </Box>
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
      {
        // notificationOpen
        true && (
          <ClickAwayListener onClickAway={handleCloseNotification}>
            <Box
              sx={{
                position: "fixed",
                top: "80px",
                right: "20px",
                minHeight: "150px",
                maxHeight: "500px",
                width: "350px",
                backgroundColor: theme.palette.background.paper,
                boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                borderRadius: "14px",
                zIndex: 1300,
                animation: "slideIn 0.3s ease-out",
                "@keyframes slideIn": {
                  from: { transform: "translateX(100%)", opacity: 0 },
                  to: { transform: "translateX(0)", opacity: 1 },
                },
              }}
            >
              <NotificationsBox />
            </Box>
          </ClickAwayListener>
        )
      }
    </>
  );
};

export default Navbar;
