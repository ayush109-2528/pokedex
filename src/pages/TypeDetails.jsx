import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const TypeDetail = () => {
  const { typeName } = useParams();
  const navigate = useNavigate();
  const [typeData, setTypeData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchType = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://pokeapi.co/api/v2/type/${typeName}`);
        const data = await res.json();
        setTypeData(data);
      } catch (error) {
        console.error('Error fetching type:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchType();
  }, [typeName]);

  const getTypeColor = (type) => {
    const colors = {
      flying: 'from-blue-400 to-indigo-500',
      fire: 'from-orange-400 to-red-500',
      water: 'from-blue-300 to-blue-500',
      // Add more as needed
    };
    return colors[typeName] || 'from-purple-400 to-pink-500';
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-8 min-h-screen bg-gradient-to-tr from-purple-600 via-pink-600 to-red-600 flex items-center justify-center">
        <div className="text-white text-xl">Loading Type Info...</div>
      </div>
    );
  }

  if (!typeData) {
    return (
      <div className="p-4 sm:p-8 min-h-screen bg-gradient-to-tr from-purple-600 via-pink-600 to-red-600 flex items-center justify-center">
        <div className="text-white text-xl">Type not found</div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 min-h-screen bg-gradient-to-tr from-purple-600 via-pink-600 to-red-600">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-4 py-2 bg-pink-500 text-white rounded-lg font-semibold hover:bg-pink-600 transition shadow-lg"
      >
        ← Back to Pokédex
      </button>

      <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border-4 border-pink-500">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className={`text-6xl font-black capitalize mb-4 bg-gradient-to-r ${getTypeColor(typeName)} bg-clip-text text-transparent`}>
            {typeName}
          </h1>
          <p className="text-xl text-gray-700 font-semibold">Type Effectiveness Chart</p>
        </div>

        {/* Damage Relations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Takes Damage From</h2>
            <div className="space-y-4">
              <DamageRow label="Double Damage From" types={typeData.damage_relations.double_damage_from} />
              <DamageRow label="Half Damage From" types={typeData.damage_relations.half_damage_from} variant="half" />
              <DamageRow label="No Damage From" types={typeData.damage_relations.no_damage_from} variant="none" />
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Deals Damage To</h2>
            <div className="space-y-4">
              <DamageRow label="Double Damage To" types={typeData.damage_relations.double_damage_to} />
              <DamageRow label="Half Damage To" types={typeData.damage_relations.half_damage_to} variant="half" />
              <DamageRow label="No Damage To" types={typeData.damage_relations.no_damage_to} variant="none" />
            </div>
          </div>
        </div>

        {/* Pokémon List */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Pokémon with {typeName} Type</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 max-h-96 overflow-y-auto">
            {typeData.pokemon.slice(0, 24).map(({ pokemon }) => (
              <div
                key={pokemon.name}
                className="p-3 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl hover:shadow-lg transition cursor-pointer group"
                onClick={() => navigate(`/pokemon/${pokemon.name}`)}
              >
                <p className="capitalize font-semibold text-gray-800 text-center group-hover:text-pink-700 transition">
                  {pokemon.name}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Sample Moves */}
        <div className="mt-12 pt-12 border-t-4 border-pink-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Signature Moves</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {typeData.moves.slice(0, 12).map((move) => (
              <span
                key={move.name}
                className="capitalize bg-gradient-to-r from-blue-400 to-indigo-500 text-white px-4 py-3 rounded-xl text-sm font-semibold text-center hover:from-blue-500 transition shadow-md cursor-pointer"
              >
                {move.name.replace('-', ' ')}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const DamageRow = ({ label, types, variant = "double" }) => {
  if (types.length === 0) return null;

  const getVariantStyle = (variant) => {
    const styles = {
      double: 'from-red-400 to-orange-500',
      half: 'from-green-400 to-emerald-500',
      none: 'from-gray-400 to-gray-600'
    };
    return styles[variant] || styles.double;
  };

  return (
    <div>
      <h3 className="font-semibold text-gray-700 mb-2">{label}</h3>
      <div className="flex flex-wrap gap-2">
        {types.map((type) => (
          <span
            key={type.name}
            className={`capitalize px-4 py-2 rounded-full font-semibold text-white shadow-lg bg-gradient-to-r ${getVariantStyle(variant)}`}
          >
            {type.name}
          </span>
        ))}
      </div>
    </div>
  );
};

export default TypeDetail;
