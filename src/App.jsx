import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";

import Dashboard from "./pages/Dashboard";
import Account from "./pages/Account";
import Bookings from "./pages/Bookings";
import Cabins from "./pages/Cabin";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import PageNotFound from "./pages/PageNotFound";
import Settings from "./pages/Settings";
import Users from "./pages/Users";
import AppLayout from "./ui/Applayout";
import BookingDetails from "./pages/Bookingd";
import CheckIn from "./pages/checkin";
import CheckOut from "./pages/checkout";
import Delete from "./ui/ConfirmDelete";
import ProtectingRoutes from "./ui/ProtectingRoutes";

// ✅ Import global responsive styles
import GlobalStyles from "./utils/GlobalStyle";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* ✅ Apply global styles once */}
      <GlobalStyles />

      <BrowserRouter>
        <Routes>
          {/* Protected routes wrapped with AppLayout */}
          <Route
            element={
              <ProtectingRoutes>
                <AppLayout />
              </ProtectingRoutes>
            }
          >
            <Route index element={<Navigate replace to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/bookings/:id" element={<BookingDetails />} />
            <Route path="/ConfirmDelete/:id" element={<Delete />} />
            <Route path="/checkin/:id" element={<CheckIn />} />
            <Route path="/checkout/:id" element={<CheckOut />} />
            <Route path="/cabins" element={<Cabins />} />
            <Route path="/users" element={<Users />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/account" element={<Account />} />
          </Route>

          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Catch all */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>

      {/* Toaster */}
      <Toaster
        position="top-center"
        gutter={12}
        containerStyle={{ margin: "8px" }}
        toastOptions={{
          success: { duration: 3000 },
          style: {
            fontSize: "16px",
            maxWidth: "600px",
            padding: "16px 24px",
            backgroundColor: "var(--color-grey-700)",
            color: "#008000",
          },
        }}
      />

      {/* React Query Devtools */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
