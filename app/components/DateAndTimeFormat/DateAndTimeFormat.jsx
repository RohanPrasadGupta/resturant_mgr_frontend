import React from "react";
import { Typography, Box, Chip } from "@mui/material";
import styles from "./DateAndTimeFormat.module.scss";

const DateAndTimeFormat = ({
  date,
  format = "full",
  showRelative = false,
  component = "span",
  className = "",
}) => {
  if (!date) {
    return (
      <Typography component={component} className={className}>
        -
      </Typography>
    );
  }

  const dateObj = new Date(date);

  // Check if date is valid
  if (isNaN(dateObj.getTime())) {
    return (
      <Typography component={component} className={className}>
        Invalid Date
      </Typography>
    );
  }

  // Get relative time (e.g., "2 hours ago")
  const getRelativeTime = (date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    const intervals = [
      { label: "year", seconds: 31536000 },
      { label: "month", seconds: 2592000 },
      { label: "day", seconds: 86400 },
      { label: "hour", seconds: 3600 },
      { label: "minute", seconds: 60 },
      { label: "second", seconds: 1 },
    ];

    for (const interval of intervals) {
      const count = Math.floor(diffInSeconds / interval.seconds);
      if (count > 0) {
        return `${count} ${interval.label}${count !== 1 ? "s" : ""} ago`;
      }
    }
    return "Just now";
  };

  // Format options
  const formatDate = () => {
    const options = {
      timeZone: "Asia/Kolkata", // Indian timezone
    };

    switch (format) {
      case "date":
        return dateObj.toLocaleDateString("en-IN", {
          ...options,
          year: "numeric",
          month: "long",
          day: "numeric",
        });

      case "time":
        return dateObj.toLocaleTimeString("en-IN", {
          ...options,
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });

      case "datetime":
        return dateObj.toLocaleString("en-IN", {
          ...options,
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });

      case "short":
        return dateObj.toLocaleDateString("en-IN", {
          ...options,
          month: "short",
          day: "numeric",
          year: "2-digit",
        });

      case "full":
      default:
        return dateObj.toLocaleString("en-IN", {
          ...options,
          weekday: "short",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
    }
  };

  const formattedDate = formatDate();
  const relativeTime = getRelativeTime(dateObj);

  if (showRelative) {
    return (
      <Box className={`${styles.dateTimeContainer} ${className}`}>
        <Typography component={component} className={styles.primaryDate}>
          {formattedDate}
        </Typography>
        <Chip
          label={relativeTime}
          size="small"
          className={styles.relativeChip}
          variant="outlined"
        />
      </Box>
    );
  }

  return (
    <Typography
      component={component}
      className={`${styles.dateTime} ${className}`}
      title={dateObj.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
    >
      {formattedDate}
    </Typography>
  );
};

export default DateAndTimeFormat;
