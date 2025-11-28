import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StatBar from '../components/StatBar';

const MAX_STAT_VALUE = 200;

const PokemonDetail = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState(null);
  const [species, setSpecies] = useState(null);
  const [activeTab, setActiveTab] = useState("stats");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPokemon = async () => {
      setLoading(true);
      try {
        const pokemonRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
        const pokemonData = await pokemonRes.json();
        setPokemon(pokemonData);

        const speciesRes = await fetch(pokemonData.species.url);
        const speciesData = await speciesRes.json();
        setSpecies(speciesData);
      } catch (error) {
        console.error('Error fetching Pokémon:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, [name]);

  if (loading) {
    return (
      <div className="p-4 sm:p-8 min-h-screen bg-gradient-to-tr from-purple-600 via-pink-600 to-red-600 flex items-center justify-center">
        <div className="text-white text-xl">Loading Pokémon...</div>
      </div>
    );
  }

  if (!pokemon || !species) {
    return (
      <div className="p-4 sm:p-8 min-h-screen bg-gradient-to-tr from-purple-600 via-pink-600 to-red-600 flex items-center justify-center">
        <div className="text-white text-xl">Pokémon not found</div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 min-h-screen bg-gradient-to-tr from-purple-600 via-pink-600 to-red-600 text-gray-900 relative">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-4 py-2 bg-pink-500 text-white rounded-lg font-semibold hover:bg-pink-600 transition shadow-lg"
      >
        ← Back to Pokédex
      </button>

      <div className="max-w-2xl mx-auto bg-gradient-to-br from-purple-300 via-pink-300 to-red-200 rounded-3xl shadow-2xl p-6 sm:p-8 border-8 border-pink-500">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
          <div className="relative w-40 sm:w-48 h-40 sm:h-48 rounded-xl shadow-lg border-4 border-pink-700 overflow-hidden bg-white flex justify-center items-center flex-shrink-0">
            <img
              src={pokemon.sprites.other?.["official-artwork"]?.front_default || pokemon.sprites.front_default}
              alt={pokemon.name}
              className="max-w-full max-h-full object-contain"
            />
            <div className="absolute top-2 left-2 flex space-x-2 z-20">
              {species.is_legendary && (
                <span className="px-2 py-1 rounded-full bg-yellow-400 text-yellow-900 font-bold uppercase text-xs shadow-md">
                  Legendary
                </span>
              )}
              {species.is_mythical && (
                <span className="px-2 py-1 rounded-full bg-purple-700 text-white font-bold uppercase text-xs shadow-md">
                  Mythical
                </span>
              )}
            </div>
          </div>

          <div className="text-center sm:text-left flex-1">
            <h1 className="text-4xl sm:text-5xl font-extrabold capitalize text-pink-700 drop-shadow-md mb-2">
              {pokemon.name}
            </h1>
            <div className="flex flex-wrap gap-2">
              {pokemon.types.map(({ type }) => (
                <span
                  key={type.name}
                  className="px-3 py-1 rounded-full bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-700 text-white font-semibold capitalize shadow-lg text-sm"
                >
                  {type.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <nav className="flex flex-wrap w-full justify-around border-b-4 border-pink-700 mb-8">
          {["stats", "details", "moves", "more-info"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 px-4 font-semibold text-center w-1/2 sm:w-auto flex-1 ${
                activeTab === tab
                  ? "text-white bg-pink-700 rounded-t-lg shadow-md"
                  : "text-pink-700 hover:bg-pink-600 hover:text-white transition"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1).replace("-", " ")}
            </button>
          ))}
        </nav>

        {/* Tab Content */}
        <div className="w-full min-h-[300px]">
          {activeTab === "stats" && (
            <>
              <div className="space-y-4 mb-8">
                {pokemon.stats.map(({ stat, base_stat }) => (
                  <StatBar
                    key={stat.name}
                    label={stat.name.replace("-", " ")}
                    value={base_stat}
                    max={MAX_STAT_VALUE}
                  />
                ))}
              </div>
              <div>
                <h4 className="text-xl font-semibold text-pink-700 mb-4 text-center sm:text-left">
                  Sound of Pokémon
                </h4>
                <audio
                  controls
                  className="w-full rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-pink-400"
                >
                  <source
                    src={`https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${pokemon.id}.ogg`}
                    type="audio/ogg"
                  />
                  Your browser does not support the audio element.
                </audio>
              </div>
            </>
          )}

          {activeTab === "details" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-800">
              <div>
                <p><strong>ID:</strong> #{pokemon.id.toString().padStart(3, '0')}</p>
                <p><strong>Height:</strong> {pokemon.height / 10}m</p>
                <p><strong>Weight:</strong> {pokemon.weight / 10}kg</p>
                <p><strong>Base Experience:</strong> {pokemon.base_experience}</p>
              </div>
              <div>
                <p className="capitalize"><strong>Abilities:</strong></p>
                <div className="mt-2 space-y-1">
                  {pokemon.abilities.map((ability, index) => (
                    <span
                      key={index}
                      className="block capitalize bg-gray-100 px-3 py-1 rounded-full text-sm"
                    >
                      {ability.ability.name} {ability.is_hidden ? '(Hidden)' : ''}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "moves" && (
            <div className="max-h-96 overflow-y-auto">
              <h3 className="font-semibold mb-4 text-lg">Moves ({pokemon.moves.length})</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {pokemon.moves.slice(0, 24).map(({ move }, index) => (
                  <span
                    key={index}
                    className="capitalize bg-gradient-to-r from-blue-400 to-blue-600 text-white px-3 py-2 rounded-lg text-sm text-center hover:from-blue-500 transition"
                  >
                    {move.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {activeTab === "more-info" && (
            <div className="space-y-4 text-gray-800">
              <div>
                <p><strong>Habitat:</strong> {species.habitat?.name || "Unknown"}</p>
                <p><strong>Generation:</strong> {species.generation.name.replace("generation-", "Gen ").toUpperCase()}</p>
                <p><strong>Growth Rate:</strong> {species.growth_rate.name.replace("-", " ").toUpperCase()}</p>
                <p><strong>Color:</strong> {species.color.name}</p>
                <p><strong>Egg Groups:</strong> {species.egg_groups.map(eg => eg.name).join(", ")}</p>
                <p><strong>Shape:</strong> {species.shape.name}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PokemonDetail;
