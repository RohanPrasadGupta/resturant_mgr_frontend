import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Paper,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import styles from "./signIn.module.scss";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { loginUserRedux } from "../../redux/storeSlice/loginUserSlice";
import { useDispatch } from "react-redux";

const SignIn = ({ handleClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const response = await fetch(
        process.env.NODE_ENV === "development"
          ? `${process.env.LOCAL_BACKEND}/api/users/login`
          : `${process.env.PROD_BACKEDN}/api/users/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ email, password }),
        }
      );

      return response.json();
    },
    onSuccess: (data) => {
      console.log("data Login", data);
      if (data.message === "Invalid email or password") {
        toast.error("Invalid email or password");
      } else {
        toast.success("Login successful!");
        console.log("data Login", data);
        dispatch(
          loginUserRedux({
            username: data?.role,
            tableNumber: data?.tableId || "",
          })
        );
        localStorage.setItem(
          "mgrUserData",
          JSON.stringify({
            username: data?.role,
            tableNumber: data?.tableId || "",
          })
        );

        handleClose();
        // relode when successful login
        // window.location.reload();
      }
    },
    onError: () => {
      toast.error("Error logging in! Please try again.");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate();
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Paper className={styles.signInContainer}>
      <IconButton
        className={styles.closeButton}
        onClick={handleClose}
        aria-label="close"
      >
        <CloseIcon />
      </IconButton>

      <Box className={styles.formHeader}>
        <Box className={styles.iconWrapper}>
          <LockOutlinedIcon className={styles.lockIcon} />
        </Box>
        <Typography variant="h5" component="h1" className={styles.title}>
          Sign In
        </Typography>
      </Box>

      <form onSubmit={handleSubmit} className={styles.form}>
        <TextField
          label="Email Address"
          variant="outlined"
          fullWidth
          required
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.textField}
          placeholder="example@email.com"
        />

        <TextField
          label="Password"
          variant="outlined"
          type={showPassword ? "text" : "password"}
          fullWidth
          required
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.textField}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={togglePasswordVisibility} edge="end">
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          className={styles.submitButton}
          disabled={isPending}
        >
          {isPending ? <CircularProgress size={28} /> : " Sign In"}
        </Button>
      </form>
    </Paper>
  );
};

export default SignIn;
