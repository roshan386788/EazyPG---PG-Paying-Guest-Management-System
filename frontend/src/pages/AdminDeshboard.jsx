import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getAllUsers } from "../features/user/userSlice";
import axiosInstance from "../api/axios";
import LogOutButton from "../components/LogOutButton";
import UserList from "../components/UserList";
import PGList from "../components/PgList";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { users, loading, error } = useSelector((state) => state.user);
  const { role } = useSelector((state) => state.auth);
  const token = localStorage.getItem("token");

  const [pgs, setPgs] = useState([]);
  const [view, setView] = useState("users"); // 'users' or 'pgs'

  useEffect(() => {
    if (!token || role !== "ADMIN") {
      navigate("/login");
    } else {
      dispatch(getAllUsers());
      fetchPGs();
    }
  }, [dispatch]);

  const fetchPGs = async () => {
    try {
      const res = await axiosInstance.get("/api/pgs");
      setPgs(res.data.content || []);
    } catch (err) {
      console.error("Failed to load PGs:", err);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axiosInstance.delete(`/api/v1/user/${userId}`);
      dispatch(getAllUsers());
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-4">
        <Link className="navbar-brand font-bold text-xl" to="/">
          EazyPG
        </Link>

        <div className="ms-auto">
          <LogOutButton />
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6 ">
        <div className="flex gap-4 mb-6 mt-4">
          <button
            onClick={() => setView("users")}
            className={`px-4 py-2 rounded m-1  ${
              view === "users"
                ? "btn btn-primary align-items-center gap-2"
                : "btn btn-outline-secondary align-items-center gap-2"
            }`}
          >
            Show Users
          </button>
          <button
            onClick={() => setView("pgs")}
            className={`px-4 py-2 rounded ${
              view === "pgs"
                ? "btn btn-primary align-items-center gap-2"
                : "btn btn-outline-secondary align-items-center gap-2"
            }`}
          >
            Show PGs
          </button>
        </div>

        {loading && <p>Loading...</p>}

        {view === "users" && (
          <div className="flex justify-center">
            <UserList users={users} onDelete={handleDeleteUser} />
          </div>
        )}
        <div>{view === "pgs" && <PGList pgs={pgs} />}</div>
      </div>
    </div>
  );
};

export default AdminDashboard;
