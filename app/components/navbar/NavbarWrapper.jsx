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
            background: "#ffffff",
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
