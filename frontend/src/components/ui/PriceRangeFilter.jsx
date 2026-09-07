import React from 'react';

const PriceRangeFilter = () => {
  return (
    <div className="mb-4">
      <h3 className="font-medium text-sm mb-2">Price Range</h3>
      <div className="flex gap-2 items-center">
        <input type="number" className="w-full p-1 border rounded" placeholder="Min" />
        <span>to</span>
        <input type="number" className="w-full p-1 border rounded" placeholder="Max" />
      </div>
    </div>
  );
};

export default PriceRangeFilter;
