import React from 'react';

const LocalityFilter = () => {
  const localities = ['Baner', 'Hinjewadi', 'Wakad', 'Viman Nagar', 'Kothrud'];

  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold mb-2">Locality</h3>
      <input
        type="text"
        placeholder="Search locality"
        className="w-full p-2 border rounded mb-3 text-sm"
      />
      <div className="flex flex-col gap-2 max-h-32 overflow-y-auto">
        {localities.map((loc) => (
          <label key={loc} className="flex items-center">
            <input type="checkbox" value={loc} className="mr-2" />
            {loc}
          </label>
        ))}
      </div>
    </div>
  );
};

export default LocalityFilter;
