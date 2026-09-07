import React from "react";
import SecureImage from "./SecureImage";
import "./PgList.css";
import { useDispatch } from "react-redux";
import { deletePg } from "../features/pg/pgSlice";
import { useNavigate } from "react-router-dom";

const PGList = ({ pgs }) => {
  const navigate = useNavigate();
  return (
    <div className="px-4 md:px-8 lg:px-16 py-6">
      <h2 className="text-2xl font-bold mb-6 text-center">All PG Properties</h2>
      <div className="pg-grid">
        {pgs.map((pg) => (
          <div
            key={pg.id}
            className="pg-card"
            onClick={() => {
              navigate("/pgdetails", { state: { pg } });
            }}
          >
            <div className="md:w-1/3 h-48 md:h-auto overflow-hidden">
              {pg.imageUrl && (
                <SecureImage
                  filename={pg.imageUrl ? pg.imageUrl.split("/").pop() : ""}
                  alt={pg.name}
                  className="object-cover w-full h-full"
                  width="50%"
                  height="50%"
                />
              )}
            </div>
            <div className="flex-1 p-4">
              <h3 className="text-xl font-semibold">{pg.name}</h3>
              <p className="text-gray-700">
                {pg.address}, {pg.city}, {pg.state} - {pg.pin}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Contact: {pg.contact}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PGList;