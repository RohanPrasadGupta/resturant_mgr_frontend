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
  Switch,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  DialogContentText,
} from "@mui/material";
import {
  Person,
  AdminPanelSettings,
  Add,
  Email as EmailIcon,
  CalendarToday as CalendarIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import CreateUser from "../details/adminComponent/CreateUser";
import LoaderComp from "../../LoaderComp/LoadingComp";
import toast from "react-hot-toast";

const UserAccess = () => {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

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

  // Fetch users query
  const {
    isLoading,
    data: userData,
    error,
  } = useQuery({
    queryKey: ["getAllUsers"],
    queryFn: () =>
      fetch(
        process.env.NODE_ENV === "development"
          ? `${process.env.LOCAL_BACKEND}/api/users`
          : `${process.env.PROD_BACKEDN}/api/users`
      ).then((res) => res.json()),
  });

  // Toggle user status mutation
  const toggleStatusMutation = useMutation({
    mutationFn: async (userId) => {
      const response = await fetch(
        process.env.NODE_ENV === "development"
          ? `${process.env.LOCAL_BACKEND}/api/users/status/${userId}`
          : `${process.env.PROD_BACKEDN}/api/users/status/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to toggle user status");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["getAllUsers"]);
      toast.success("User status updated successfully!");
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`, "error");
    },
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (userId) => {
      const response = await fetch(
        process.env.NODE_ENV === "development"
          ? `${process.env.LOCAL_BACKEND}/api/users/${userId}`
          : `${process.env.PROD_BACKEDN}/api/users/${userId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete user");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["getAllUsers"]);
      toast.success("User deleted successfully!");
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`, "error");
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    },
  });

  // Edit user mutation
  const editUserMutation = useMutation({
    mutationFn: async ({ userId, userData }) => {
      const response = await fetch(
        process.env.NODE_ENV === "development"
          ? `${process.env.LOCAL_BACKEND}/api/users/${userId}`
          : `${process.env.PROD_BACKEDN}/api/users/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update user");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["getAllUsers"]);
      toast.success("User updated successfully!");
      setEditDialogOpen(false);
      setSelectedUser(null);
      setEditForm({ name: "", email: "", password: "", role: "user" });
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`, "error");
    },
  });

  // Handle toggle status
  const handleToggleStatus = (userId) => {
    toggleStatusMutation.mutate(userId);
  };

  // Handle delete user - open confirmation dialog
  const handleDeleteUser = (user) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  // Confirm delete user
  const confirmDeleteUser = () => {
    if (userToDelete) {
      deleteUserMutation.mutate(userToDelete._id);
    }
  };

  // Cancel delete
  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  // Handle edit user
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      password: "", // Don't prefill password for security
      role: user.role,
    });
    setEditDialogOpen(true);
  };

  // Handle edit form submission
  const handleEditSubmit = () => {
    if (!editForm.name || !editForm.email) {
      toast.error("Name and email are required!", "error");
      return;
    }

    const updateData = {
      name: editForm.name,
      email: editForm.email,
      role: editForm.role,
    };

    // Only include password if it's provided
    if (editForm.password.trim()) {
      updateData.password = editForm.password;
    }

    editUserMutation.mutate({
      userId: selectedUser._id,
      userData: updateData,
    });
  };

  if (isLoading) {
    return <LoaderComp />;
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6" color="error">
          Error fetching user data. Please try again later.
        </Typography>
      </Box>
    );
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
          {userData?.map((user) => (
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
                            ? "rgba(255, 87, 34, 0.1)"
                            : "rgba(255, 152, 0, 0.1)",
                        width: 45,
                        height: 45,
                        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                      }}
                    >
                      {user?.role === "admin" ? (
                        <AdminPanelSettings
                          sx={{
                            color: "#ff5722",
                            fontSize: "1.4rem",
                          }}
                        />
                      ) : (
                        <Person
                          sx={{
                            color: "#ff9800",
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

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
                </Box>

                {/* User details section */}
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
                          bgcolor: alpha("#ff5722", 0.05),
                        }}
                      >
                        <EmailIcon
                          sx={{ color: "#ff5722", fontSize: "1rem" }}
                        />
                        <Tooltip title={user?.email || "No email provided"}>
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
                          bgcolor: alpha("#ff9800", 0.05),
                        }}
                      >
                        <CalendarIcon
                          sx={{ color: "#ff9800", fontSize: "1rem" }}
                        />
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          Created: {formatDate(user?.createdAt)}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>

                {/* Action buttons */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mt: 3,
                    pt: 2,
                    borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Status:
                    </Typography>
                    <Switch
                      checked={user?.isActive === true}
                      onChange={() => handleToggleStatus(user._id)}
                      size="small"
                      sx={{
                        "& .MuiSwitch-thumb": {
                          boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                        },
                        "& .MuiSwitch-track": {
                          backgroundColor: user?.isActive
                            ? "#ff9800"
                            : undefined,
                        },
                        "& .Mui-checked": {
                          color: "#ff5722 !important",
                        },
                        "& .Mui-checked + .MuiSwitch-track": {
                          backgroundColor: "#ff9800 !important",
                        },
                      }}
                    />
                  </Box>

                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Tooltip title="Edit User">
                      <IconButton
                        size="small"
                        onClick={() => handleEditUser(user)}
                        sx={{
                          background:
                            "linear-gradient(90deg, #ff5722, #ff9800)",
                          color: "white",
                          width: 32,
                          height: 32,
                          "&:hover": {
                            background:
                              "linear-gradient(90deg, #e64a19, #f57c00)",
                            transform: "scale(1.1)",
                          },
                          transition: "all 0.2s ease",
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Delete User">
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteUser(user)}
                        sx={{
                          background:
                            "linear-gradient(90deg, #ff5722, #ff9800)",
                          color: "white",
                          width: 32,
                          height: 32,
                          "&:hover": {
                            background:
                              "linear-gradient(90deg, #d32f2f, #f57c00)",
                            transform: "scale(1.1)",
                          },
                          transition: "all 0.2s ease",
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={cancelDelete}
        maxWidth="sm"
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: "12px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            color: "#ff5722",
            fontWeight: 600,
          }}
        >
          <WarningIcon sx={{ fontSize: "2rem", color: "#ff5722" }} />
          Confirm Delete User
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontSize: "1rem", lineHeight: 1.6 }}>
            Are you sure you want to delete the user{" "}
            <strong style={{ color: theme.palette.text.primary }}>
              {userToDelete?.name}
            </strong>
            ?
            <br />
            <br />
            <span style={{ color: "#ff5722", fontWeight: 500 }}>
              This action cannot be undone.
            </span>{" "}
            All data associated with this user will be permanently removed from
            the system.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ padding: "16px 24px" }}>
          <Button
            onClick={cancelDelete}
            variant="outlined"
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              borderColor: "#ff9800",
              color: "#ff9800",
              "&:hover": {
                borderColor: "#ff5722",
                backgroundColor: alpha("#ff5722", 0.05),
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDeleteUser}
            variant="contained"
            disabled={deleteUserMutation.isLoading}
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              background: "linear-gradient(90deg, #ff5722, #ff9800) !important",
              boxShadow: "0 4px 12px rgba(255, 87, 34, 0.3)",
              "&:hover": {
                boxShadow: "0 6px 16px rgba(255, 87, 34, 0.4)",
                transform: "translateY(-1px)",
              },
              transition: "all 0.2s ease",
            }}
          >
            {deleteUserMutation.isLoading ? "Deleting..." : "Delete User"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: "12px",
          },
        }}
      >
        <DialogTitle
          sx={{ fontWeight: 600, fontSize: "1.25rem", color: "#ff5722" }}
        >
          Edit User
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField
              label="Name"
              value={editForm.name}
              onChange={(e) =>
                setEditForm({ ...editForm, name: e.target.value })
              }
              fullWidth
              required
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": {
                    borderColor: "#ff5722",
                  },
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#ff5722",
                },
              }}
            />
            <TextField
              label="Email"
              type="email"
              value={editForm.email}
              onChange={(e) =>
                setEditForm({ ...editForm, email: e.target.value })
              }
              fullWidth
              required
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": {
                    borderColor: "#ff5722",
                  },
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#ff5722",
                },
              }}
            />
            <TextField
              label="Password (Leave empty to keep current)"
              type="password"
              value={editForm.password}
              onChange={(e) =>
                setEditForm({ ...editForm, password: e.target.value })
              }
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": {
                    borderColor: "#ff5722",
                  },
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#ff5722",
                },
              }}
            />
            <FormControl fullWidth>
              <InputLabel
                sx={{
                  "&.Mui-focused": {
                    color: "#ff5722",
                  },
                }}
              >
                Role
              </InputLabel>
              <Select
                value={editForm.role}
                label="Role"
                onChange={(e) =>
                  setEditForm({ ...editForm, role: e.target.value })
                }
                sx={{
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#ff5722",
                  },
                }}
              >
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ padding: "16px 24px" }}>
          <Button
            onClick={() => setEditDialogOpen(false)}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              color: "#ff9800",
              "&:hover": {
                backgroundColor: alpha("#ff9800", 0.05),
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleEditSubmit}
            variant="contained"
            disabled={editUserMutation.isLoading}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "8px",
              px: 3,
              background: "linear-gradient(90deg, #ff5722, #ff9800) !important",
              boxShadow: "0 4px 12px rgba(255, 87, 34, 0.3)",
              "&:hover": {
                boxShadow: "0 6px 16px rgba(255, 87, 34, 0.4)",
                transform: "translateY(-1px)",
              },
              transition: "all 0.2s ease",
            }}
          >
            {editUserMutation.isLoading ? "Updating..." : "Update User"}
          </Button>
        </DialogActions>
      </Dialog>

      <CreateUser open={open} handleClose={handleClose} />
    </>
  );
};

export default UserAccess;
