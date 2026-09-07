import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import FindPG from "../pages/FindPG";
import PGDetails from "../pages/PGDetails";
import Unauthorized from "../pages/Unauthorized";
import ProtectedRoute from "../pages/ProtectedRoute";

// Your role-specific dashboard components
import PublicRoute from "./PublicRoute";
import AddPG from "../pages/AddPg";
import OwnerDashboard from "../pages/OwnerDeshboard";
import UserProfile from "../pages/UserProfile";
import AdminDashboard from "../pages/AdminDeshboard";
import RazorpayPaymentPage from "../pages/RazorpayPaymentPage";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route path="/pgdetails" element={<PGDetails />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pg-owner"
          element={
            <ProtectedRoute allowedRoles={["OWNER"]}>
              <OwnerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tenant"
          element={
            <ProtectedRoute allowedRoles={["TENANT"]}>
              <FindPG />
            </ProtectedRoute>
          }
        />

        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/add-pg" element={<AddPG />} />
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/razorpay-payment" element={<RazorpayPaymentPage />} />
      </Routes>
    </BrowserRouter>
  );
}
