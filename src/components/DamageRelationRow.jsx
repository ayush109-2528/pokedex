import React from 'react';

const DamageRelationRow = ({ label, types, variant = "double" }) => {
  if (!types?.length) return null;

  const styles = {
    double: { 
      bg: "from-red-500 to-orange-500", 
      icon: "⚡", 
      multiplier: "2x",
      borderColor: "border-red-400/60"
    },
    half: { 
      bg: "from-emerald-500 to-green-500", 
      icon: "🛡️", 
      multiplier: "½x",
      borderColor: "border-emerald-400/60"
    },
    immune: { 
      bg: "from-gray-500 to-slate-500", 
      icon: "🚫", 
      multiplier: "0x",
      borderColor: "border-gray-400/60"
    },
  };

  const { bg, icon, multiplier, borderColor } = styles[variant] || styles.double;

  return (
    <div className={`p-5 sm:p-6 lg:p-8 bg-gradient-to-r bg-white/80 rounded-2xl lg:rounded-3xl shadow-xl border-l-4 lg:border-l-8 ${borderColor} hover:shadow-2xl hover:-translate-y-1 transition-all duration-300`}>
      {/* Header Row */}
      <div className="flex items-center justify-between sm:justify-start sm:gap-4 mb-4 sm:mb-6 flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <span className="text-xl sm:text-2xl lg:text-3xl shrink-0">{icon}</span>
          <h4 className={`text-lg sm:text-xl lg:text-2xl font-black text-gray-800 capitalize`}>
            {label}
          </h4>
        </div>
        <span className="px-3 py-1 sm:px-4 sm:py-2 bg-gradient-to-r from-white/90 to-transparent rounded-xl lg:rounded-2xl text-lg sm:text-xl font-black text-gray-900 shadow-lg shrink-0">
          {multiplier}
        </span>
      </div>
      
      {/* Types Grid */}
      <div className="flex flex-wrap gap-2 sm:gap-3 lg:gap-4 justify-center sm:justify-start">
        {types.map((type) => (
          <span
            key={type.name}
            className={`capitalize px-4 sm:px-5 lg:px-6 py-2 sm:py-3 lg:py-4 rounded-xl lg:rounded-2xl font-bold text-white shadow-lg bg-gradient-to-r ${bg} text-sm sm:text-base hover:scale-105 hover:shadow-xl transition-all duration-300 cursor-pointer group relative overflow-hidden`}
            title={`View ${type.name} type`}
          >
            <span className="relative z-10">
              {type.name
                .replace(/-/g, " ")
                .replace(/\b\w/g, (l) => l.toUpperCase())}
            </span>
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </span>
        ))}
      </div>
      
      {/* Type count badge */}
      <div className="mt-3 text-right">
        <span className="px-3 py-1 bg-white/60 text-gray-700 text-xs font-bold rounded-full shadow-md">
          {types.length} type{types.length !== 1 ? 's' : ''}
        </span>
      </div>
    </div>
  );
};

export default DamageRelationRow;
