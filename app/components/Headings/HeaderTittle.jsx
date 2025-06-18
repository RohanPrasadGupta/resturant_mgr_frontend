import { Box } from "@mui/material";
import React from "react";

const HeaderTittle = ({ title }) => {
  return (
    <Box
      sx={{
        fontSize: "1.5rem",
        fontWeight: "bold",
        color: "#333",
        marginBottom: "1rem",
        textAlign: "center",
        padding: "10px 0",
        borderBottom: "2px solid #ccc",
      }}
    >
      {title}
    </Box>
  );
};

export default HeaderTittle;
