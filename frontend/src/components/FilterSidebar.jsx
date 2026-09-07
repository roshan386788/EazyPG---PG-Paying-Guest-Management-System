import React from 'react';
import StayTypeFilter from './ui/StayTypeFilter';
import GenderFilter from './ui/GenderFilter';
import PriceRangeFilter from './ui/PriceRangeFilter';
import SortByFilter from './ui/SortByFilter';
import AmenitiesFilter from './ui/AmenitiesFilter';
import LocalityFilter from './ui/LocalityFilter';


const stayTypes = ['Coliving', 'Student Living'];
const sortBy = ['Price Low to High', 'Price High to Low'];
const sharingTypes = ['Private', '2 Sharing', '3 Sharing', 'More than 3 Sharing'];
const genders = ['Men', 'Women', 'Unisex'];
const amenities = ['AC', 'Gym', 'Food', 'Fridge', 'Parking', 'Power Backup'];
const localities = [
  'Aundegaon', 'Balewadi', 'Baner', 'Dhankawadi', 'Hingadspur',
  'Hingaswadi Phase 1', 'Hingaswadi Phase 3'
];


export default  function SidebarFilters() {
  return (
    <div className="w-[280px] p-4 bg-white border rounded shadow-sm h-[calc(100vh-100px)] overflow-y-auto sticky top-24">
  <h2 className="text-sm font-bold mb-4">Filters</h2>

      <StayTypeFilter />
      <GenderFilter />
      <PriceRangeFilter/>
      <SortByFilter/>
      <AmenitiesFilter />
      <LocalityFilter localities={localities} />
    </div>
  );
}