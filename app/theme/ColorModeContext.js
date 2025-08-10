"use client";
import React from "react";

// Simple context to expose a toggle method for light/dark mode
export const ColorModeContext = React.createContext({
  toggleColorMode: () => {},
});
