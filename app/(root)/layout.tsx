import Navbar from "@/components/Navbar";
import React from "react";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      <div className="root-layout mt-28">{children}</div>{" "}
    </>
  );
};

export default RootLayout;
