import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css"; // For extra styling
import { Home } from "lucide-react";
import { useDispatch } from "react-redux";
import { logoutUser } from "../features/auth/authSlice";
import { getAllPgs } from "../features/pg/pgSlice";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const role = localStorage.getItem("role");

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    dispatch(logoutUser());
    navigate("/", { replace: true });
  };

  // Search PGs by city
  const handleSearch = () => {
    dispatch(getAllPgs(searchTerm.trim()));
  };

  return (
    <nav className="navbar navbar-expand-lg eazy-navbar shadow-sm px-4">
      <Link className="navbar-brand eazy-brand" to="/">
        <span className="brand-icon">
          <Home size={18} strokeWidth={2.5} />
        </span>
        Eazy<span className="brand-accent">PG</span>
      </Link>

      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div
        className="collapse navbar-collapse justify-content-between"
        id="navbarNav"
      >
        {/* SEARCH BAR IN CENTER */}
        {role !== "OWNER" ? (
          <div className="d-flex mx-auto search-container">
            <input
              type="text"
              className="form-control rounded-start-pill"
              placeholder="Search city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              style={{ borderRight: "none" }}
            />
            <button
              className="btn btn-primary rounded-end-pill"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
        ) : null}

        {role === "OWNER" && (
          <Link
            className="btn btn-primary"
            style={{ alignSelf: "flex-end" }}
            to="/add-pg"
          >
            Add PG
          </Link>
        )}

        {/* RIGHT USER ICON DROPDOWN */}
        <div className="dropdown ms-3">
          <i
            className="fa-solid fa-circle-user fa-2x"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            style={{ cursor: "pointer", color: "#DBE2EF" }}
          ></i>
          {dropdownOpen && (
            <div className="dropdown-menu dropdown-menu-end show mt-2">
              <button
                className="dropdown-item"
                onClick={() => navigate("/user-profile")}
              >
                Profile
              </button>
              <button className="dropdown-item" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
