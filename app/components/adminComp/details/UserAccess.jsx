import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
  Paper,
  Divider,
  Avatar,
  alpha,
  useTheme,
  Tooltip,
  Grid,
} from "@mui/material";
import {
  Person,
  AdminPanelSettings,
  Add,
  Email as EmailIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import CreateUser from "../details/adminComponent/CreateUser";
import LoaderComp from "../../LoaderComp/LoadingComp";

const UserAccess = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Format date nicely
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return dateString;
    }
  };

  const {
    isLoading,
    data: userData,
    error,
  } = useQuery({
    queryKey: ["getAllUsers"],
    queryFn: () =>
      fetch(`https://resturant-mgr-backend.onrender.com/api/users`).then(
        (res) => res.json()
      ),
  });

  if (isLoading) {
    return <LoaderComp />;
  }

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          borderRadius: "16px",
          background: alpha(theme.palette.background.paper, 0.8),
          backdropFilter: "blur(10px)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            mb: 4,
            gap: 2,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: theme.palette.mode === "dark" ? "#f5f5f5" : "#212529",
                fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
                position: "relative",
                "&:after": {
                  content: '""',
                  position: "absolute",
                  bottom: -8,
                  left: 0,
                  width: "60px",
                  height: "4px",
                  borderRadius: "2px",
                  background: "linear-gradient(90deg, #ff5722, #ff9800)",
                },
              }}
            >
              User Settings
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Manage user accounts and access permissions
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleOpen}
            sx={{
              background: "linear-gradient(90deg, #ff5722, #ff9800) !important",
              borderRadius: "8px",
              boxShadow: "0 4px 10px rgba(255, 87, 34, 0.3)",
              padding: "10px 20px",
              fontWeight: 600,
              textTransform: "none",
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: "0 6px 15px rgba(255, 87, 34, 0.4)",
                transform: "translateY(-2px)",
              },
            }}
          >
            Add New User
          </Button>
        </Box>

        <Divider sx={{ mb: 4, opacity: 0.6 }} />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(auto-fill, minmax(280px, 1fr))",
              md: "repeat(auto-fill, minmax(320px, 1fr))",
            },
            gap: "20px",
          }}
        >
          {userData.map((user) => (
            <Card
              key={user._id}
              sx={{
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                transition: "all 0.3s ease",
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                },
                position: "relative",
                "&:before":
                  user?.role === "admin"
                    ? {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        right: 0,
                        width: "60px",
                        height: "60px",
                        background:
                          "linear-gradient(135deg, transparent 50%, rgba(255, 87, 34, 0.1) 50%)",
                      }
                    : {},
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor:
                          user?.role === "admin"
                            ? "rgba(220, 53, 69, 0.1)"
                            : "rgba(0, 123, 255, 0.1)",
                        width: 45,
                        height: 45,
                        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                      }}
                    >
                      {user?.role === "admin" ? (
                        <AdminPanelSettings
                          sx={{
                            color: "#dc3545",
                            fontSize: "1.4rem",
                          }}
                        />
                      ) : (
                        <Person
                          sx={{
                            color: "#007bff",
                            fontSize: "1.4rem",
                          }}
                        />
                      )}
                    </Avatar>
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          mb: 0.5,
                        }}
                      >
                        {user?.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: theme.palette.text.secondary,
                          textTransform: "capitalize",
                          fontWeight: 500,
                        }}
                      >
                        {user?.role}
                      </Typography>
                    </Box>
                  </Box>

                  <Chip
                    label={user?.isActive === true ? "Active" : "Inactive"}
                    color={user?.isActive === true ? "success" : "default"}
                    size="small"
                    sx={{
                      borderRadius: "6px",
                      fontWeight: 600,
                      fontSize: "0.7rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      boxShadow:
                        user?.isActive === true
                          ? "0 2px 6px rgba(76, 175, 80, 0.2)"
                          : "none",
                    }}
                  />
                </Box>

                {/* User details section with styled email and date */}
                <Box sx={{ mt: 2 }}>
                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          p: 1,
                          borderRadius: "8px",
                          bgcolor: alpha(theme.palette.primary.main, 0.05),
                          transition: "all 0.2s ease",
                          "&:hover": {
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                          },
                        }}
                      >
                        <EmailIcon
                          sx={{
                            color: "#2196f3",
                            fontSize: "1rem",
                          }}
                        />
                        <Tooltip
                          title={user?.email || "No email provided"}
                          placement="top"
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 500,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              maxWidth: "180px",
                            }}
                          >
                            {user?.email || "No email provided"}
                          </Typography>
                        </Tooltip>
                      </Box>
                    </Grid>

                    <Grid item xs={12}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          p: 1,
                          borderRadius: "8px",
                          bgcolor: alpha(theme.palette.secondary.main, 0.05),
                          transition: "all 0.2s ease",
                          "&:hover": {
                            bgcolor: alpha(theme.palette.secondary.main, 0.1),
                          },
                        }}
                      >
                        <CalendarIcon
                          sx={{
                            color: "#9c27b0",
                            fontSize: "1rem",
                          }}
                        />
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          Created: {formatDate(user?.createdAt)}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Paper>
      <CreateUser open={open} handleClose={handleClose} />
    </>
  );
};

export default UserAccess;
