import React from 'react';

const SortByFilter = () => {
  const options = ['Relevance', 'Price - Low to High', 'Price - High to Low'];

  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold mb-2">Sort By</h3>
      <div className="flex flex-col gap-2">
        {options.map((option, idx) => (
          <label key={idx} className="flex items-center">
            <input
              type="radio"
              name="sortBy"
              value={option.toLowerCase().replace(/[^a-z]/g, '')}
              className="mr-2"
              defaultChecked={idx === 0}
            />
            {option}
          </label>
        ))}
      </div>
    </div>
  );
};

export default SortByFilter;
