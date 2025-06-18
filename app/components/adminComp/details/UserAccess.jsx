import React from "react";
import { Box, Typography, Card, CardContent, Chip } from "@mui/material";
import { Person, AdminPanelSettings } from "@mui/icons-material";

const UserAccess = () => {
  const users = [
    { id: 1, name: "John Doe", role: "Admin", status: "Active" },
    { id: 2, name: "Jane Smith", role: "Manager", status: "Active" },
    { id: 3, name: "Bob Johnson", role: "User", status: "Inactive" },
    { id: 4, name: "Alice Brown", role: "Manager", status: "Active" },
  ];

  return (
    <Box>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 600,
          color: "#212529",
          marginBottom: "24px",
          fontSize: { xs: "1.5rem", md: "2rem" },
        }}
      >
        User Settings
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(2, 1fr)",
          },
          gap: "16px",
        }}
      >
        {users.map((user) => (
          <Card
            key={user.id}
            sx={{
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              transition: "transform 0.2s ease-in-out",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
              },
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "16px",
                }}
              >
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: "12px" }}
                >
                  {user.role === "Admin" ? (
                    <AdminPanelSettings sx={{ color: "#dc3545" }} />
                  ) : (
                    <Person sx={{ color: "#007bff" }} />
                  )}
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {user.name}
                  </Typography>
                </Box>
                <Chip
                  label={user.status}
                  color={user.status === "Active" ? "success" : "default"}
                  size="small"
                />
              </Box>
              <Typography variant="body2" color="text.secondary">
                Role: {user.role}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default UserAccess;
