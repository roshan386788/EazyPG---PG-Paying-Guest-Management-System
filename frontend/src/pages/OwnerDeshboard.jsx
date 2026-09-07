import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import PGCard from "../components/PGCard";
import { getPgsByOwner } from "../features/pg/pgSlice";

const OwnerDashboard = () => {
  const [pgs, setPgList] = useState([]);
  const dispatch = useDispatch();

  const { role } = useSelector((state) => state.auth);
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId"); // This must be saved in login thunk

  const navigate = useNavigate();
  const { pgList, loading, error } = useSelector((state) => state.pg);

  useEffect(() => {
    if (!token || role !== "OWNER") {
      navigate("/login");
      return;
    }

    if (userId) {
      dispatch(getPgsByOwner(userId));
    }
  }, [dispatch, token, role, userId, navigate]);


  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 m-5">
          {pgList.map((pg, index) => (
            <PGCard key={index} data={pg} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
