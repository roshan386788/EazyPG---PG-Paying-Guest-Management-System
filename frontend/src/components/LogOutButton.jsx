import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../features/auth/authSlice"; // your logout action

const LogOutButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear localStorage tokens
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    // Dispatch logout action to reset redux state
    dispatch(logoutUser());

    // Redirect to login or home page
    navigate("/", { replace: true });
  };

  return (
    <button
      onClick={handleLogout}
      className="btn btn-outline-danger d-flex align-items-center rounded-pill px-3 py-2"
      style={{ minWidth: "130px" }}
      aria-label="Logout"
    >
      {/* //error */}
      <i class="fa-solid fa-arrow-right-from-bracket"></i>
      <span className="ms-auto fw-semibold" style={{ marginLeft: "10px" }}>
        Logout
      </span>
    </button>
  );
};

export default LogOutButton;
