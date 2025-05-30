import React from "react";
import Navbar from "../components/navbar/Navbar";

const layout = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

export default layout;
