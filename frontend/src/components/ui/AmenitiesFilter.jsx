import React from 'react';

const AmenitiesFilter = () => {
  const amenities = ['WiFi', 'Laundry', 'CCTV', 'Power Backup', 'Meals'];

  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold mb-2">Amenities</h3>
      <div className="flex flex-col gap-2">
        {amenities.map((item) => (
          <label key={item} className="flex items-center">
            <input type="checkbox" value={item} className="mr-2" />
            {item}
          </label>
        ))}
      </div>
    </div>
  );
};

export default AmenitiesFilter;
