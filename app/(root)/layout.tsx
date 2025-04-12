import Navbar from "@/components/Navbar";
import React from "react";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      <div className="root-layout">{children}</div>{" "}
    </>
  );
};

export default RootLayout;
