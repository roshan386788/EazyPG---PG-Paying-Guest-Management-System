import React, { useState, useEffect } from "react";
import "./FindPG.css";
import "bootstrap/dist/css/bootstrap.min.css";
import PGCard from "../components/PGCard";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { SlidersHorizontal, MapPin, Search } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getAllPgs } from "../features/pg/pgSlice";

const POPULAR_CITIES = ["Pune", "Mumbai", "Bengaluru", "Hyderabad", "Delhi", "Chennai"];

const FindPG = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pgList, loading, error } = useSelector((state) => state.pg);
  const [pgs, setPgs] = useState([]);
  const [city, setCity] = useState("");

  const [filters, setFilters] = useState({
    gender: "",
    roomType: "",
    maxBudget: "",
  });

  // Load PGs from API
  useEffect(() => {
    dispatch(getAllPgs());
  }, [dispatch]);

  // Update PGs to display when PG list changes
  useEffect(() => {
    setPgs(pgList);
  }, [pgList]);

  // Filter PGs on filter change
  useEffect(() => {
    let filtered = pgList;

    if (filters.gender) {
      filtered = filtered.filter(
        (pg) => pg.type?.toLowerCase() === filters.gender.toLowerCase()
      );
    }

    if (filters.roomType) {
      filtered = filtered.filter((pg) =>
        pg.rooms?.some(
          (room) =>
            room?.roomType &&
            room.roomType.toLowerCase() === filters.roomType.toLowerCase()
        )
      );
    }

    if (filters.maxBudget) {
      const max = parseInt(filters.maxBudget);
      filtered = filtered.filter((pg) =>
        pg.rooms?.some((room) => room?.rent <= max)
      );
    }

    setPgs(filtered);
  }, [filters, pgList]);

  // Get current location once
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          localStorage.setItem("latitude", latitude);
          localStorage.setItem("longitude", longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, []);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const clearFilters = () => {
    setFilters({
      gender: "",
      roomType: "",
      maxBudget: "",
    });
  };

  const handleHeroSearch = (e) => {
    e.preventDefault();
    dispatch(getAllPgs(city.trim()));
  };

  const handleCityChip = (chipCity) => {
    setCity(chipCity);
    dispatch(getAllPgs(chipCity));
  };

  return (
    <div className="eazy-page">
      <Navbar />

      {/* HERO */}
      <section className="eazy-hero">
        <div className="eazy-hero-inner">
          <h1 className="eazy-hero-title">
            Find a PG that feels like home
          </h1>
          <p className="eazy-hero-subtitle">
            Verified rooms, real photos, honest prices — all in one place.
          </p>
        </div>

        <form className="eazy-search-card" onSubmit={handleHeroSearch}>
          <div className="eazy-search-field">
            <MapPin size={18} className="eazy-search-icon" />
            <input
              type="text"
              placeholder="Search by city, e.g. Pune"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <button type="submit" className="eazy-search-btn">
            <Search size={16} />
            Search PGs
          </button>
        </form>
      </section>

      {/* CITY CHIPS */}
      <div className="eazy-chip-row">
        <span className="eazy-chip-label">Popular:</span>
        {POPULAR_CITIES.map((c) => (
          <button
            key={c}
            className="eazy-chip"
            onClick={() => handleCityChip(c)}
            type="button"
          >
            {c}
          </button>
        ))}
      </div>

      <div className="eazy-body">
        {/* Filter Section */}
        <aside className="eazy-filter-panel">
          <h3 className="eazy-filter-heading">
            <SlidersHorizontal size={18} />
            Filter PGs
          </h3>

          <div className="mb-3">
            <label htmlFor="gender" className="eazy-filter-label">Gender</label>
            <select
              id="gender"
              name="gender"
              className="form-control"
              value={filters.gender}
              onChange={handleFilterChange}
            >
              <option value="">All</option>
              <option value="Boys">Boys</option>
              <option value="Girls">Girls</option>
              <option value="Unisex">Unisex</option>
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="roomType" className="eazy-filter-label">Room Type</label>
            <select
              id="roomType"
              name="roomType"
              className="form-control"
              value={filters.roomType}
              onChange={handleFilterChange}
            >
              <option value="">All</option>
              <option value="Single">Single</option>
              <option value="Double">Double</option>
              <option value="Triple">Triple</option>
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="maxBudget" className="eazy-filter-label">Max Budget (₹/mo)</label>
            <input
              type="number"
              id="maxBudget"
              name="maxBudget"
              className="form-control"
              placeholder="e.g. 12000"
              value={filters.maxBudget}
              onChange={handleFilterChange}
            />
          </div>

          <button className="eazy-clear-btn" onClick={clearFilters}>
            Clear Filters
          </button>
        </aside>

        {/* PG View Section */}
        <section className="eazy-results-panel">
          <div className="eazy-results-heading">
            {loading ? "Searching PGs..." : `${pgs.length} PG${pgs.length === 1 ? "" : "s"} found`}
          </div>

          {loading ? (
            <p>Loading PGs...</p>
          ) : (
            <div className="pg-grid">
              {pgs.length === 0 ? (
                <p className="eazy-empty-msg">No PGs match the selected filters.</p>
              ) : (
                pgs.map((pg) => (
                  <PGCard
                    key={pg.id}
                    data={pg}
                    onCardClick={() => {
                      navigate("/pgdetails", { state: { pg } });
                    }}
                  />
                ))
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default FindPG;
