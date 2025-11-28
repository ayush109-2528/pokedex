const StatBar = ({ label, value, max }) => {
  const percentage = Math.min((value / max) * 100, 100);
  return (
    <div className="mb-2">
      <div className="flex justify-between text-sm font-semibold mb-1 text-gray-700">
        <span className="capitalize">{label}</span>
        <span>{value}</span>
      </div>
      <div className="w-full bg-gray-300 rounded-full h-3">
        <div
          className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 h-3 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default StatBar;
