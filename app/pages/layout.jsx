import React from "react";
import NavbarWrapper from "../components/navbar/NavbarWrapper";

const layout = ({ children }) => {
  return (
    <>
      <NavbarWrapper />
      {children}
    </>
  );
};

export default layout;
