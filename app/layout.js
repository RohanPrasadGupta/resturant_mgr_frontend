"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { ColorModeContext } from "./theme/ColorModeContext";
import React, { useMemo, useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import store from "./redux/store/store";
import AuthPersistence from "./components/AuthPersistence";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const queryClient = new QueryClient();
  const [mode, setMode] = useState("light");

  // Load stored preference
  useEffect(() => {
    try {
      const stored = localStorage.getItem("mgrColorMode");
      if (stored === "light" || stored === "dark") setMode(stored);
    } catch (e) {}
  }, []);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prev) => {
          const next = prev === "light" ? "dark" : "light";
          try {
            localStorage.setItem("mgrColorMode", next);
          } catch (e) {}
          return next;
        });
      },
    }),
    []
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: "#ff9800",
            dark: "#ef6c00",
          },
          secondary: { main: "#ff5722" },
          background: {
            default: mode === "light" ? "#f8f9fa" : "#121212",
            paper: mode === "light" ? "#ffffff" : "#1e1e1e",
          },
        },
        shape: { borderRadius: 10 },
        components: {
          MuiAppBar: {
            styleOverrides: {
              root: {
                background: "linear-gradient(45deg, #ff9800, #ff5722)",
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              containedPrimary: {
                background: "linear-gradient(45deg, #ff9800, #ff5722)",
              },
            },
          },
        },
      }),
    [mode]
  );

  return (
    <html lang="en" data-theme={mode}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ColorModeContext.Provider value={colorMode}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Provider store={store}>
              <AuthPersistence />
              <QueryClientProvider client={queryClient}>
                {children}
              </QueryClientProvider>
            </Provider>
          </ThemeProvider>
        </ColorModeContext.Provider>
        <Toaster
          position="right-top"
          gutter={12}
          containerStyle={{ margin: "30px" }}
          toastOptions={{
            success: {
              duration: 3000,
            },
            error: { duration: 3000 },
            style: {
              fontSize: "16px",
              maxWidth: "500px",
              padding: "16px 24px",
              backgroundColor: "var(--color-grey-0",
              color: "var(--color-grey-700)",
            },
          }}
        />
      </body>
    </html>
  );
}
