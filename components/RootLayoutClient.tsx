"use client";
import QueryProvider from "@/provider/QueryProvider";
import React from "react";
import { ToastContainer } from "react-toastify";

const RootLayoutClient = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <QueryProvider>{children}</QueryProvider>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        theme="light"
      />
    </>
  );
};

export default RootLayoutClient;
