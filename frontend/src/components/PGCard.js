import "./PGCard.css";
import { MapPin, Phone, IndianRupee } from "lucide-react";
import SecureImage from "./SecureImage"; // Update path if needed
import { useNavigate } from "react-router-dom";

const PGCard = ({ data: pg, onCardClick }) => {
  const navigate = useNavigate();
  const { name, type, address, city, state, pin, contact, imageUrl, rooms } = pg;

  const location = `${address}, ${city}, ${state} - ${pin}`;
  const filename = imageUrl?.split("/").pop();
  const role = localStorage.getItem("role");

  const rents = (rooms || [])
    .map((r) => r?.rent)
    .filter((r) => typeof r === "number" && r > 0);
  const minRent = rents.length ? Math.min(...rents) : null;

  return (
    <div className="pg-card my-3" onClick={() =>  navigate("/pgdetails", { state: { pg } })}>
      <div className="pg-image-container md:w-1/3 h-48 md:h-auto overflow-hidden">
        {filename && (
          <SecureImage
            filename={filename}
            alt={name}
            width="100%"
            height="100%"
          />
        )}
        {type && <span className="pg-type-badge">{type}</span>}
      </div>

      <div className="pg-body">
        {name && <h3 className="pg-title">{name}</h3>}

        {location && (
          <div className="pg-distance">
            <MapPin size={15} />
            <span>{location}</span>
          </div>
        )}

        {contact && (
          <div className="pg-distance">
            <Phone size={15} />
            <span>{contact}</span>
          </div>
        )}

        {minRent !== null && (
          <div className="pg-price-section">
            <div className="pg-price">
              <IndianRupee size={15} />
              {minRent.toLocaleString("en-IN")}
              <span className="pg-price-suffix">/mo onwards</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PGCard;
