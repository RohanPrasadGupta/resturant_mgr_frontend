"use client";
import { Suspense } from "react";
import Navbar from "./Navbar";
import LoaderComp from "../LoaderComp/LoadingComp";

const NavbarWrapper = () => {
  return (
    <Suspense
      fallback={
        <div
          style={{
            height: "64px",
            background: "#1976d2",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
          }}
        >
          <LoaderComp />
        </div>
      }
    >
      <Navbar />
    </Suspense>
  );
};

export default NavbarWrapper;
