import React, { useMemo, useState } from "react";
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Collapse,
  Typography,
  Chip,
  Stack,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";
import VerifiedIcon from "@mui/icons-material/Verified";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const currency = new Intl.NumberFormat("en-NP", {
  style: "currency",
  currency: "NPR",
  maximumFractionDigits: 0,
});

function formatDateTime(iso) {
  try {
    const d = new Date(iso);
    return `${d.toLocaleDateString()} • ${d.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  } catch {
    return "-";
  }
}

const CompleteORderCard = ({ order }) => {
  const [expanded, setExpanded] = useState(false);

  const paymentLower = (order?.paymentMethod || "").toLowerCase();
  const chipColor =
    paymentLower === "cash"
      ? "success"
      : paymentLower === "online"
      ? "primary"
      : "default";
  const paymentLabel = paymentLower ? paymentLower.toUpperCase() : "PAYMENT";

  const itemCount = useMemo(
    () =>
      Array.isArray(order?.items)
        ? order.items.reduce((n, it) => n + (it.quantity || 0), 0)
        : 0,
    [order]
  );

  const shortId = useMemo(
    () => (order?._id ? `#${order._id.slice(-6)}` : "#—"),
    [order?._id]
  );

  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 2,
        overflow: "hidden",
        width: "100%",
        bgcolor: (t) =>
          t.palette.mode === "dark" ? "background.paper" : "#fff",
        userSelect: "none",
      }}
      onClick={() => {
        setExpanded((prev) => !prev);
      }}
      role="button"
      aria-expanded={expanded}
    >
      <CardHeader
        sx={{ cursor: "pointer", pb: 0.5 }}
        avatar={<VerifiedIcon color="success" />}
        title={
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            flexWrap="wrap"
          >
            <Typography
              variant="subtitle1"
              fontWeight={700}
              sx={{ fontSize: { xs: 14, sm: 16 } }}
            >
              Table {order?.tableNumber || "—"}
            </Typography>
            <Chip
              size="small"
              label={order?.status || "completed"}
              color="success"
              variant="outlined"
              sx={{ pointerEvents: "none" }}
            />
          </Stack>
        }
        subheader={
          <Typography variant="caption" color="text.secondary">
            {formatDateTime(order?.createdAt)} • {shortId}
          </Typography>
        }
        action={
          <Stack direction="row" alignItems="center" spacing={1} pr={1}>
            <Chip
              size="small"
              label={paymentLabel}
              color={chipColor}
              variant="filled"
              sx={{
                pointerEvents: "none",
                ...(paymentLower === "online" ? { color: "#fff" } : {}),
              }}
            />
            <Tooltip title={expanded ? "Hide details" : "Show details"}>
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  setExpanded((prev) => !prev);
                }}
                aria-expanded={expanded}
                aria-label="toggle details"
                size="small"
                sx={{
                  transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform .2s ease",
                }}
              >
                <ExpandMoreIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        }
      />

      <CardContent sx={{ pt: 1.5, pb: 1 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          rowGap={1}
        >
          <Typography variant="body2" color="text.secondary">
            {itemCount} items
          </Typography>
          <Typography
            variant="h6"
            fontWeight={800}
            sx={{ fontSize: { xs: 16, sm: 20 } }}
          >
            {typeof order?.total === "number"
              ? currency.format(order.total)
              : "—"}
          </Typography>
        </Stack>
      </CardContent>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Divider />
        <CardContent sx={{ pt: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Order Details
          </Typography>
          <Stack divider={<Divider flexItem />} spacing={1}>
            {(order?.items || []).map((it) => {
              const lineTotal = (it.quantity || 0) * (it.price || 0);
              return (
                <Box
                  key={it._id}
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 1,
                    flexWrap: "wrap",
                  }}
                >
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="body1"
                      fontWeight={600}
                      sx={{
                        wordBreak: "break-word",
                        fontSize: { xs: 14, sm: 16 },
                      }}
                    >
                      {it.menuItem || "—"}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Qty: {it.quantity || 0} × {currency.format(it.price || 0)}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body1"
                    fontWeight={700}
                    sx={{ fontSize: { xs: 14, sm: 16 } }}
                  >
                    {currency.format(lineTotal)}
                  </Typography>
                </Box>
              );
            })}
          </Stack>

          <Divider sx={{ my: 2 }} />
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="subtitle1" fontWeight={700}>
              Total
            </Typography>
            <Typography variant="h6" fontWeight={900}>
              {typeof order?.total === "number"
                ? currency.format(order.total)
                : "—"}
            </Typography>
          </Stack>
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default CompleteORderCard;
