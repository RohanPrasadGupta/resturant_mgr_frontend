import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Typography,
  IconButton,
  Chip,
  ListItem,
  Divider,
  Skeleton,
  Button,
  useTheme,
  alpha,
} from "@mui/material";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { timeAgo } from "../../constants/ConversionFunctions";

// Resolve backend base with NEXT_PUBLIC fallbacks for client-side usage
function resolveBackendBase() {
  const dev =
    process.env.NEXT_PUBLIC_LOCAL_BACKEND || process.env.LOCAL_BACKEND || "";
  const prod =
    process.env.NEXT_PUBLIC_PROD_BACKEND || process.env.PROD_BACKEND || "";
  const base = process.env.NODE_ENV === "development" ? dev : prod;
  return base?.replace(/\/$/, "");
}

// Expose component props to control fetching from parent (e.g., only when admin + panel open)
// enabled: boolean to start fetching
// onLoaded: optional callback with notifications array
const NotificationsBox = ({ enabled = true, onLoaded }) => {
  const [notificationsData, setNotificationsData] = useState([]);
  const queryClient = useQueryClient();
  const theme = useTheme();

  const {
    isLoading: notificationLoading,
    data: notificationData,
    error: notificationError,
    refetch,
  } = useQuery({
    queryKey: ["getNotifications"],
    enabled, // prevents unauthorized or premature fetches
    refetchOnWindowFocus: false,
    refetchOnMount: enabled,
    queryFn: async () => {
      const base = resolveBackendBase();
      if (!base) throw new Error("Backend base URL not configured");
      const res = await fetch(`${base}/api/notifications`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Failed to fetch notifications");
      return res.json();
    },
  });

  useEffect(() => {
    if (notificationData?.notifications) {
      const filteredNotifications = notificationData.notifications.filter(
        (n) => !n.hideMark === true
      );
      setNotificationsData(filteredNotifications);
      onLoaded && onLoaded(filteredNotifications);
    } else if (!enabled) {
      // Do nothing; fetch not enabled yet
    }
  }, [notificationData, enabled, onLoaded]);

  const { mutate: markAllRead, isLoading: isMarkAllRead } = useMutation({
    mutationFn: async () => {
      const base = resolveBackendBase();
      if (!base) throw new Error("Backend base URL not configured");
      const res = await fetch(`${base}/api/notifications/read/all`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Failed to mark all as read");
    },
    onSuccess: () => queryClient.invalidateQueries(["getNotifications"]),
  });

  const { mutate: markAllHide, isLoading: isMarkAllHide } = useMutation({
    mutationFn: async () => {
      const base = resolveBackendBase();
      if (!base) throw new Error("Backend base URL not configured");
      const res = await fetch(`${base}/api/notifications/hide/all`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Failed to hide all");
    },
    onSuccess: () => queryClient.invalidateQueries(["getNotifications"]),
  });

  const handleAllReadFunc = () => {
    markAllRead();
  };
  const handleAllHideFunc = () => {
    markAllHide();
  };

  const limitNotificationDesc = (desc) => {
    if (!desc) return "";
    return desc.length > 10 ? desc.slice(0, 10) + "..." : desc;
  };

  if (notificationLoading && enabled) {
    return (
      <Box
        sx={{ p: 2, maxHeight: 500, display: "flex", flexDirection: "column" }}
      >
        <HeaderSkeleton />
        <Box sx={{ mt: 2 }}>
          {Array.from({ length: 4 }).map((_, i) => (
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

  if (notificationError && enabled) {
    return (
      <Box
        sx={{
          minHeight: 500,
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

  if (
    enabled &&
    !notificationLoading &&
    !notificationError &&
    notificationsData.length === 0
  ) {
    return (
      <Box
        sx={{
          p: 4,
          height: 300,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          borderRadius: 2,
        }}
      >
        <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
          No notifications
        </Typography>
        <Typography variant="caption" color="text.disabled">
          You are all caught up!
        </Typography>
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
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          pb: 1,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.4)}`,
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Notifications
        </Typography>
        {notificationsData.length > 0 && (
          <Chip
            label={notificationsData.length}
            size="small"
            sx={{
              fontWeight: 600,
              bgcolor: theme.palette.primary.main,
              color: "#fff",
            }}
          />
        )}
      </Box>

      <Box
        sx={{
          marginTop: 1,
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
          "&::-webkit-scrollbar": {
            display: "none",
          },
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {notificationsData.map((n) => {
          const unread = !n.readMark;
          return (
            <ListItem
              key={n._id}
              sx={{
                mb: 1,
                p: 1.5,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: unread
                  ? alpha(theme.palette.primary.main, 0.08)
                  : theme.palette.background.paper,
                borderLeft: `4px solid ${
                  unread ? theme.palette.primary.main : "transparent"
                }`,
                border: `1px solid ${alpha(
                  unread ? theme.palette.primary.main : theme.palette.divider,
                  unread ? 0.6 : 0.4
                )}`,
                boxShadow: unread
                  ? "0 4px 14px -6px rgba(0,0,0,.25)"
                  : "0 2px 10px -6px rgba(0,0,0,.1)",
                transition: "all 0.25s ease",
                "&:hover": {
                  backgroundColor: alpha(
                    theme.palette.primary.main,
                    unread ? 0.15 : 0.05
                  ),
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <IconButton
                  size="medium"
                  sx={{
                    backgroundColor: theme.palette.primary.main,
                    color: "#fff",
                  }}
                >
                  {unread ? <NotificationsActiveIcon /> : <NotificationsIcon />}
                </IconButton>

                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 600,
                      lineHeight: 1.3,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {`New order complete.`}
                  </Typography>
                  <Chip
                    label={`Order ID: ${limitNotificationDesc(n.orderId)}`}
                    size="small"
                    sx={{
                      mt: 0.5,
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      backgroundColor: theme.palette.primary.main,
                      color: "#fff",
                    }}
                  />
                </Box>
              </Box>

              <Box sx={{ textAlign: "right" }}>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 500,
                    color: alpha(theme.palette.text.secondary, 0.85),
                  }}
                >
                  {timeAgo(n.createdAt)}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: theme.palette.success.main,
                  }}
                >
                  ₹{n.orderValue}
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
          onClick={handleAllReadFunc}
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
          {isMarkAllRead ? "Marking..." : "Mark read"}
        </Button>
        <Button
          variant="outlined"
          color="error"
          size="small"
          onClick={handleAllHideFunc}
          startIcon={<DeleteSweepIcon />}
          sx={{ textTransform: "none", flex: 1 }}
        >
          {isMarkAllHide ? "Clearing..." : "Clear all"}
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
