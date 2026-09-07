const GenderFilter = () => {
  const options = ['Men', 'Women', 'Unisex'];
  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold mb-2">Gender</h3>
      <div className="flex flex-col gap-2">
        {options.map((gender) => (
          <label key={gender} className="flex items-center text-sm">
            <input type="radio" name="gender" value={gender} className="mr-2" />
            {gender}
          </label>
        ))}
      </div>
    </div>
  );
};

export default GenderFilter;
