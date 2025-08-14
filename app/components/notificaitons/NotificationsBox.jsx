import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Typography,
  IconButton,
  CircularProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Tooltip,
  Divider,
  Skeleton,
  Button,
  useTheme,
  alpha,
} from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import RefreshIcon from "@mui/icons-material/Refresh";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import CloseIcon from "@mui/icons-material/Close";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";

const endpointBase =
  process.env.NODE_ENV === "development"
    ? process.env.LOCAL_BACKEND
    : process.env.PROD_BACKEDN;

const iconMap = {
  order: <RestaurantIcon fontSize="small" />,
  inventory: <Inventory2Icon fontSize="small" />,
  status: <AssignmentTurnedInIcon fontSize="small" />,
  warning: <WarningAmberIcon fontSize="small" />,
  default: <NotificationsNoneIcon fontSize="small" />,
};

const timeAgo = (ts) => {
  if (!ts) return "";
  const diff = Date.now() - new Date(ts).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "now";
  if (m < 60) return m + "m";
  const h = Math.floor(m / 60);
  if (h < 24) return h + "h";
  const d = Math.floor(h / 24);
  return d + "d";
};

const NotificationsBox = ({ onClose }) => {
  const theme = useTheme();
  const queryClient = useQueryClient();

  const {
    isLoading: notificationLoading,
    data,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["getNotifications"],
    queryFn: async () => {
      const res = await fetch(`${endpointBase}/api/notifications`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Failed to load notifications");
      return res.json();
    },
    refetchOnWindowFocus: false,
    staleTime: 15000,
  });

  if (notificationLoading) {
    return (
      <Box sx={{ p: 2, height: 500, display: "flex", flexDirection: "column" }}>
        <HeaderSkeleton />
        <Box sx={{ mt: 2 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Box key={i} sx={{ display: "flex", gap: 2, mb: 2 }}>
              <Skeleton variant="circular" width={40} height={40} />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width="70%" />
                <Skeleton variant="text" width="40%" />
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          height: 500,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 3,
        }}
      >
        <Alert severity="error" sx={{ fontWeight: 500 }}>
          Failed to load notifications: {error.message}
        </Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
        borderRadius: "14px",
        overflow: "hidden",
        padding: "15px 5px 10px 5px",
      }}
    >
      <Box
        sx={{
          minHeight: "200px",
          maxHeight: "400px",
          borderRadius: "8px",
          overflowY: "auto",
          zIndex: 1300,
          animation: "slideIn 0.3s ease-out",
          "@keyframes slideIn": {
            from: { transform: "translateX(100%)", opacity: 0 },
            to: { transform: "translateX(0)", opacity: 1 },
          },
        }}
      >
        {data?.notifications.map((n) => {
          const unread = !n.read;
          return (
            <ListItem
              key={n._id}
              sx={{
                mb: 1,
                borderRadius: 2,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                width: "100%",
                justifyContent: "space-between",
                background: unread
                  ? alpha(theme.palette.primary.main, 0.08)
                  : alpha(theme.palette.background.paper, 0.6),
                border: `1px solid ${alpha(
                  unread ? theme.palette.primary.main : theme.palette.divider,
                  unread ? 0.6 : 0.4
                )}`,
                boxShadow: unread
                  ? "0 4px 14px -6px rgba(0,0,0,.35)"
                  : "0 2px 10px -6px rgba(0,0,0,.15)",
                position: "relative",
                overflow: "hidden",
                cursor: "default",
                transition: "all .25s ease",
                "&:hover": {
                  background: alpha(
                    theme.palette.primary.main,
                    unread ? 0.15 : 0.1
                  ),
                  transform: "translateY(-2px)",
                },
              }}
            >
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Chip
                    label={`Order Id: ${n?.orderId}`}
                    size="small"
                    sx={{
                      height: 18,
                      fontSize: "0.6rem",
                      fontWeight: 700,
                      background: "linear-gradient(90deg,#ff9800,#ff5722)",
                      color: "#fff",
                    }}
                  />
                </Typography>

                <Typography
                  variant="caption"
                  sx={{
                    mt: 0.5,
                    display: "inline-block",
                    fontWeight: 500,
                    letterSpacing: ".5px",
                    color: alpha(theme.palette.text.secondary, 0.85),
                  }}
                >
                  Time ago: {timeAgo(n.createdAt)}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    mt: 0.5,
                    display: "inline-block",
                    fontWeight: 500,
                    letterSpacing: ".5px",
                    color: alpha(theme.palette.text.secondary, 0.85),
                  }}
                >
                  NRP: {n.orderValue}
                </Typography>
              </Box>
            </ListItem>
          );
        })}
      </Box>
      <Divider />

      <Box
        sx={{
          display: "flex",
          gap: 1,
          p: 1,
          background: theme.palette.mode === "dark" ? "#262626" : "#fafafa",
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.4)}`,
        }}
      >
        <Button
          variant="outlined"
          size="small"
          startIcon={<DoneAllIcon />}
          //   disabled={unreadCount === 0 || markAllReadMutation.isLoading}
          //   onClick={() => markAllReadMutation.mutate()}
          sx={{
            textTransform: "none",
            borderColor: "#ff9800",
            color: "#ff9800",
            flex: 1,
            "&:hover": {
              borderColor: "#ff9800",
              background: "rgba(255,152,0,0.1)",
            },
          }}
        >
          Mark read
        </Button>
        <Button
          variant="outlined"
          color="error"
          size="small"
          startIcon={<DeleteSweepIcon />}
          //   disabled={notificationsRaw.length === 0 || clearAllMutation.isLoading}
          //   onClick={() => clearAllMutation.mutate()}
          sx={{ textTransform: "none", flex: 1 }}
        >
          Clear all
        </Button>
      </Box>
    </Box>
  );
};

const HeaderSkeleton = () => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
    <Skeleton variant="rounded" height={32} width={180} />
    <Skeleton variant="circular" height={30} width={30} />
    <Skeleton variant="circular" height={30} width={30} />
  </Box>
);

export default NotificationsBox;
