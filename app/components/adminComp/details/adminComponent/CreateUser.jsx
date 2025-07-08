import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Modal,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  IconButton,
  InputAdornment,
  Alert,
  useTheme,
  Divider,
  alpha,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Visibility, VisibilityOff, PersonAdd } from "@mui/icons-material";

const CreateUser = ({ open, handleClose }) => {
  const theme = useTheme();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "staff",
  });

  // Form validation
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.role) {
      newErrors.role = "Role is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createUserMutation = useMutation({
    mutationFn: (userData) => {
      return fetch(
        "https://resturant-mgr-backend.onrender.com/api/users/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
        }
      ).then((res) => {
        if (!res.ok) {
          return res.json().then((data) => {
            throw new Error(data.message || "Failed to create user");
          });
        }
        return res.json();
      });
    },
    onSuccess: () => {
      setFormData({ name: "", email: "", password: "", role: "staff" });
      setSubmitSuccess(true);
      setSubmitError("");

      queryClient.invalidateQueries(["getAllUsers"]);

      setTimeout(() => {
        handleClose();
        setSubmitSuccess(false);
      }, 2000);
    },
    onError: (error) => {
      setSubmitError(error.message || "Error creating user. Please try again.");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitError("");

    if (validateForm()) {
      createUserMutation.mutate(formData);
    }
  };

  const onModalClose = () => {
    setFormData({ name: "", email: "", password: "", role: "staff" });
    setErrors({});
    setSubmitError("");
    setSubmitSuccess(false);
    handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={onModalClose}
      aria-labelledby="create-user-modal"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: 400 },
          maxWidth: "95%",
          bgcolor: "background.paper",
          borderRadius: "16px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
          p: { xs: 2, sm: 3 },
          border: "none",
          outline: "none",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}>
          <PersonAdd
            sx={{
              color: "primary.main",
              fontSize: 28,
              padding: 0.5,
              borderRadius: "50%",
              bgcolor: alpha(theme.palette.primary.main, 0.1),
            }}
          />
          <Typography variant="h5" component="h2" sx={{ color: "black" }}>
            Create New User
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {submitSuccess && (
          <Alert severity="success" sx={{ mb: 3 }} variant="filled">
            User created successfully!
          </Alert>
        )}

        {submitError && (
          <Alert severity="error" sx={{ mb: 3 }} variant="filled">
            {submitError}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
            error={!!errors.name}
            helperText={errors.name}
            autoComplete="off"
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            error={!!errors.email}
            helperText={errors.email}
            autoComplete="off"
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            error={!!errors.password}
            helperText={errors.password}
            autoComplete="new-password"
            sx={{ mb: 2 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleTogglePassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <FormControl
            fullWidth
            margin="normal"
            error={!!errors.role}
            sx={{ mb: 3 }}
          >
            <InputLabel>Role</InputLabel>
            <Select
              name="role"
              value={formData.role}
              label="Role"
              onChange={handleChange}
            >
              <MenuItem value="staff">Staff</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
            {errors.role && <FormHelperText>{errors.role}</FormHelperText>}
          </FormControl>

          <Box
            sx={{
              mt: 3,
              display: "flex",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Button
              variant="outlined"
              onClick={onModalClose}
              sx={{ flex: 1 }}
              disabled={createUserMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                flex: 1,
                background:
                  "linear-gradient(90deg, #ff5722, #ff9800) !important",
                boxShadow: "0 4px 10px rgba(255, 87, 34, 0.3)",
                "&:hover": {
                  boxShadow: "0 6px 15px rgba(255, 87, 34, 0.4)",
                  transform: "translateY(-2px)",
                },
                transition: "all 0.3s ease",
              }}
              disabled={createUserMutation.isPending}
            >
              {createUserMutation.isPending ? "Creating..." : "Create User"}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default CreateUser;
