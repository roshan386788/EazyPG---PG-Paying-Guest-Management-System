import React from 'react';

const StayTypeFilter = () => {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold mb-2">Stay Type</h3>
      <div className="flex flex-col gap-2">
        {['All', 'Coliving', 'Hostel', 'PG'].map((type) => (
          <label key={type} className="flex items-center">
            <input type="radio" name="stayType" value={type} className="mr-2" defaultChecked={type === 'All'} />
            {type}
          </label>
        ))}
      </div>
    </div>
  );
};

export default StayTypeFilter;
