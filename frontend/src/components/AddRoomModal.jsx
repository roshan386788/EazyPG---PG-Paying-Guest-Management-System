import React, { useState } from "react";
import axiosInstance from "../api/axios";
import { jwtDecode } from "jwt-decode";

const AddRoomModal = ({ pgId, onClose }) => {
  const [form, setForm] = useState({
    number: "",
    type: "SINGLE",
    rent: "",
    available: true,
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  console.log("token", decodedToken.userId);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("token");
    const decodedToken = jwtDecode(token);

    // Build FormData like Postman
    const formData = new FormData();
    formData.append(
      "room",
      JSON.stringify({
        number: form.number,
        type: form.type,
        rent: parseFloat(form.rent),
        available: form.available,
      })
    );
    if (image) {
      formData.append("image", image);
    }

    try {
      const res = await axiosInstance.post(
        `/api/pgs/${pgId}/rooms`, // notice: in Postman it's pgs, not pg
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-User-Id": decodedToken.userId || decodedToken.sub,
          },
        }
      );

      console.log("✅ Room added:", res.data);
      onClose();
    } catch (error) {
      console.error("❌ Error adding room:", error.response || error);
      alert(error.response?.data?.message || "Failed to add room");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      className="modal show d-block"
      style={{ background: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog">
        <div className="modal-content p-4" style={{ borderRadius: "12px" }}>
          <h5 className="modal-title mb-3">Add Room</h5>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="number"
              className="form-control mb-3"
              placeholder="Room Number"
              value={form.number}
              onChange={handleChange}
              required
            />
            <select
              name="type"
              className="form-control mb-3"
              value={form.type}
              onChange={handleChange}
            >
              <option value="SINGLE">Single</option>
              <option value="DOUBLE">Double</option>
              <option value="TRIPLE">Triple</option>
            </select>
            <input
              type="number"
              name="rent"
              className="form-control mb-3"
              placeholder="Rent"
              value={form.rent}
              onChange={handleChange}
              required
            />
            <div className="form-check mb-3">
              <input
                type="checkbox"
                name="available"
                className="form-check-input"
                checked={form.available}
                onChange={handleChange}
              />
              <label className="form-check-label">Available</label>
            </div>
            <input
              type="file"
              accept="image/*"
              className="form-control mb-3"
              onChange={handleFileChange}
            />
            <div className="d-flex justify-content-end">
              <button
                type="button"
                className="btn btn-secondary me-2"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Adding..." : "Add Room"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddRoomModal;
