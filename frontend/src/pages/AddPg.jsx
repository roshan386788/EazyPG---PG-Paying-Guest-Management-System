import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addPg } from "../features/pg/pgSlice";

const AddPG = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.pg);

  const [pgData, setPgData] = useState({
    name: "",
    type: "BOYS",
    address: "",
    city: "",
    state: "",
    pin: "",
    contact: "",
    latitude: "",
    longitude: "",
  });

  const [image, setImage] = useState(null);

  const formFields = [
    { name: "name", placeholder: "Name", required: true },
    { name: "address", placeholder: "Address", required: true },
    { name: "city", placeholder: "City", required: true },
    { name: "state", placeholder: "State", required: true },
    { name: "pin", placeholder: "Pin", required: true },
    { name: "contact", placeholder: "Contact", required: true },
    { name: "latitude", placeholder: "Latitude", required: true },
    { name: "longitude", placeholder: "Longitude", required: true },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPgData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const pgPayload = {
      ...pgData,
      latitude: parseFloat(pgData.latitude),
      longitude: parseFloat(pgData.longitude),
    };

    const formData = new FormData();
    formData.append(
      "pg",
      new Blob([JSON.stringify(pgPayload)], { type: "application/json" })
    );
    if (image) formData.append("image", image);

    dispatch(addPg(formData))
      .unwrap()
      .then(() => {
        navigate(-1);
      })
      .catch((err) => {
        console.error("Error adding PG:", err);
      });
  };

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center">
      <div className="row w-100" style={{ maxWidth: "1000px" }}>
        <div className="d-flex align-items-center justify-content-center">
          <div
            className="card shadow p-4 w-100"
            style={{ maxWidth: "400px", borderRadius: "16px" }}
          >
            <h3 className="mb-4 text-center">Add PG</h3>
            <form onSubmit={handleSubmit}>
              {formFields.map(({ name, placeholder, required }) => (
                <div key={name}>
                  <input
                    type="text"
                    name={name}
                    value={pgData[name] || ""}
                    onChange={handleChange}
                    placeholder={placeholder}
                    required={required}
                    className="form-control mb-3"
                  />
                </div>
              ))}

              <div>
                <select
                  name="type"
                  value={pgData.type}
                  onChange={handleChange}
                  className="form-control mb-3"
                >
                  <option value="BOYS">Boys</option>
                  <option value="GIRLS">Girls</option>
                  <option value="UNISEX">Unisex</option>
                </select>
              </div>

              <div className="mb-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="form-control"
                />
              </div>


              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? "Adding PG..." : "Add PG"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPG;
