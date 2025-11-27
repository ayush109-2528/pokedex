import React, { useEffect, useState } from "react";

function StatBar({ label, value, max }) {
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
}

const BASIC_STATS = ["hp", "attack", "defense"];
const MAX_STAT_VALUE = 200;

const FILTER_TABS = [
  { key: "all", label: "All" },
  { key: "legendary", label: "Legendary" },
  { key: "mythical", label: "Mythical" },
  { key: "mega", label: "Mega Evolutions" },
  { key: "type", label: "Type" },
];

export default function App() {
  const [allPokemons, setAllPokemons] = useState([]);
  const [speciesData, setSpeciesData] = useState({});
  const [megaSprites, setMegaSprites] = useState({});
  const [displayedPokemons, setDisplayedPokemons] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [selectedSpecies, setSelectedSpecies] = useState(null);
  const [typesData, setTypesData] = useState({});
  const [selectedType, setSelectedType] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [activeTab, setActiveTab] = useState("stats");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTab, setFilterTab] = useState("all");
  const [basicStats, setBasicStats] = useState({});

  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=1118")
      .then((res) => res.json())
      .then(async (data) => {
        setAllPokemons(data.results);
        setDisplayedPokemons(data.results.slice(0, 100));

        const speciesAndMega = await Promise.all(
          data.results.map(async (p) => {
            const pokemonRes = await fetch(p.url);
            const pokemon = await pokemonRes.json();
            const speciesRes = await fetch(pokemon.species.url);
            const species = await speciesRes.json();

            const megaForms = await Promise.all(
              species.varieties
                .filter((v) => v.pokemon.name.toLowerCase().includes("mega"))
                .map(async (v) => {
                  const megaRes = await fetch(v.pokemon.url);
                  const megaData = await megaRes.json();
                  return {
                    name: v.pokemon.name,
                    sprite:
                      megaData.sprites.other["official-artwork"]
                        .front_default || megaData.sprites.front_default,
                  };
                })
            );

            return { species, megaForms, name: p.name };
          })
        );

        const speciesMap = {};
        const megaSpriteMap = {};
        speciesAndMega.forEach(({ species, megaForms, name }) => {
          speciesMap[name] = species;
          if (megaForms.length > 0) {
            megaForms.forEach((form) => {
              megaSpriteMap[form.name] = form.sprite;
            });
          }
        });

        setSpeciesData(speciesMap);
        setMegaSprites(megaSpriteMap);

        const typesRes = await fetch("https://pokeapi.co/api/v2/type");
        const typesData = await typesRes.json();
        const typesMap = {};
        typesData.results.forEach((type) => {
          typesMap[type.name] = type.url;
        });
        setTypesData(typesMap);
      });
  }, []);

  useEffect(() => {
    let filtered = allPokemons;

    if (filterTab === "legendary") {
      filtered = filtered.filter(
        (p) => speciesData[p.name] && speciesData[p.name].is_legendary
      );
    } else if (filterTab === "mythical") {
      filtered = filtered.filter(
        (p) => speciesData[p.name] && speciesData[p.name].is_mythical
      );
    } else if (filterTab === "mega") {
      // Filter only names that exactly end with "-mega" (case-insensitive)
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().endsWith("-mega")
      );
    } else if (filterTab === "type" && selectedType) {
      fetch(typesData[selectedType])
        .then((res) => res.json())
        .then((data) => {
          const typePokemonNames = data.pokemon.map((p) => p.pokemon.name);
          const filteredByType = allPokemons.filter((p) =>
            typePokemonNames.includes(p.name)
          );
          setDisplayedPokemons(
            searchTerm.trim() === ""
              ? filteredByType
              : filteredByType.filter((p) =>
                  p.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
          );
        });
      return;
    }

    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setDisplayedPokemons(filtered);
  }, [
    filterTab,
    selectedType,
    searchTerm,
    allPokemons,
    speciesData,
    megaSprites,
    typesData,
  ]);

  const fetchBasicStats = (url, name) => {
    if (basicStats[name]) return;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const stats = {};
        data.stats.forEach(({ stat, base_stat }) => {
          if (BASIC_STATS.includes(stat.name)) {
            stats[stat.name] = base_stat;
          }
        });
        setBasicStats((prev) => ({ ...prev, [name]: stats }));
      });
  };

  const fetchPokemonDetails = (url) => {
    setLoadingDetails(true);
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setSelectedPokemon(data);
        return fetch(data.species.url);
      })
      .then((res) => res.json())
      .then((species) => {
        setSelectedSpecies(species);
        setActiveTab("stats");
        setLoadingDetails(false);
      })
      .catch(() => setLoadingDetails(false));
  };

  const closeModal = () => {
    setSelectedPokemon(null);
    setSelectedSpecies(null);
  };

  const getGlitterClass = (name) => {
    if (!speciesData[name]) return "glitter-default";
    if (speciesData[name].is_legendary) return "glitter-gold";
    if (speciesData[name].is_mythical) return "glitter-mythical";
    if (basicStats[name] && basicStats[name].hp > 150) return "glitter-blue";
    return "glitter-default";
  };

  const getSpriteUrl = (name, pokemonUrl) => {
    // Mega sprites fallback - show base official artwork if mega or base sprite missing
    if (filterTab === "mega" && megaSprites[name]) {
      return megaSprites[name];
    }
    const id = pokemonUrl.split("/").filter(Boolean).pop();
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
  };

  return (
    <div className="p-8 max-w-7xl mx-auto relative font-sans bg-gradient-to-tr from-purple-600 via-pink-600 to-red-600 min-h-screen text-gray-900">
      <h1 className="text-5xl font-extrabold mb-1 text-center text-white drop-shadow-lg">
        Pokédex
      </h1>
      {/* Total Pokémon count */}
      <p className="mb-6 text-center text-white font-semibold text-lg">
        Total Pokémon: {allPokemons.length}
      </p>

      {/* Filter Tabs */}
      <nav className="flex justify-center space-x-4 mb-6 flex-wrap gap-2">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setFilterTab(tab.key);
              if (tab.key !== "type") setSelectedType(null);
            }}
            className={`px-6 py-2 rounded-full font-semibold text-white uppercase tracking-wide transition ${
              filterTab === tab.key
                ? "bg-pink-600 shadow-lg"
                : "bg-pink-400 hover:bg-pink-600"
            }`}
          >
            {tab.label}
          </button>
        ))}
        {filterTab === "type" && (
          <select
            className="ml-4 px-3 py-2 rounded-lg font-semibold text-gray-900"
            onChange={(e) => setSelectedType(e.target.value)}
            value={selectedType || ""}
          >
            <option value="" disabled>
              Select Type
            </option>
            {Object.keys(typesData).map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        )}
      </nav>

      {/* Search Bar */}
      <div className="max-w-md mx-auto mb-8">
        <input
          type="text"
          placeholder="Search Pokémon..."
          className="w-full px-4 py-3 rounded-lg font-semibold shadow-lg focus:outline-none focus:ring-4 focus:ring-pink-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Pokémon Grid */}
      <div className="grid grid-cols-5 gap-6">
        {displayedPokemons.length === 0 && (
          <p className="text-center col-span-5 text-white font-semibold">
            No Pokémon found.
          </p>
        )}
        {displayedPokemons.map(({ name, url }) => {
          const spriteUrl = getSpriteUrl(name, url);
          const stats = basicStats[name] || {};
          const glitterClass = getGlitterClass(name);

          return (
            <div
              key={name}
              className={`${glitterClass} cursor-pointer overflow-hidden flex flex-col items-center px-2 py-3 group relative`}
              onClick={() => fetchPokemonDetails(url)}
              onMouseEnter={() => fetchBasicStats(url, name)}
            >
              <div className="flex justify-center items-center w-full h-32 rounded-lg shadow-lg p-3 bg-white relative z-0">
                <img
                  src={spriteUrl}
                  alt={name}
                  className="max-w-full max-h-full object-contain"
                />
              </div>

              <div className="mt-3 font-semibold capitalize text-center text-lg tracking-wide text-white drop-shadow-md">
                {name}
              </div>

              {/* Hover basics overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-pink-900 via-purple-800 to-transparent opacity-0 group-hover:opacity-90 transition-opacity flex flex-col justify-center items-center p-4 text-white text-center pointer-events-none z-10 rounded-xl">
                {BASIC_STATS.map((stat) => (
                  <div key={stat} className="capitalize text-sm mb-1">
                    {stat}: {stats[stat] ?? "..."}
                  </div>
                ))}
                <div className="text-xs mt-2 italic">Basic Stats</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {selectedPokemon && selectedSpecies && (
        <>
          <div
            className="fixed inset-0 bg-gradient-to-tr from-purple-900 via-pink-900 to-red-900 bg-opacity-90 backdrop-blur-md z-40"
            onClick={closeModal}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-6">
            <div className="relative bg-gradient-to-br from-purple-300 via-pink-300 to-red-200 rounded-3xl shadow-2xl max-w-sm w-full max-h-[90vh] overflow-y-auto text-gray-900 p-6 font-sans border-8 border-pink-500 flex flex-col items-center">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-pink-700 hover:text-red-700 transition text-4xl font-bold z-50"
                aria-label="Close modal"
              >
                &times;
              </button>

              <div className="relative w-48 h-48 rounded-xl shadow-lg border-4 border-pink-700 overflow-hidden mb-4 bg-white flex justify-center items-center">
                <img
                  src={
                    selectedPokemon.sprites.other["official-artwork"]
                      .front_default || selectedPokemon.sprites.front_default
                  }
                  alt={selectedPokemon.name}
                  className="max-w-full max-h-full object-contain"
                />
                <div className="absolute top-2 left-2 flex space-x-2 z-20">
                  {selectedSpecies.is_legendary && (
                    <span className="px-2 py-1 rounded-full bg-yellow-400 text-yellow-900 font-bold uppercase text-xs shadow-md">
                      Legendary
                    </span>
                  )}
                  {selectedSpecies.is_mythical && (
                    <span className="px-2 py-1 rounded-full bg-purple-700 text-white font-bold uppercase text-xs shadow-md">
                      Mythical
                    </span>
                  )}
                </div>
              </div>

              <h2 className="text-3xl font-extrabold capitalize text-pink-700 drop-shadow-md mb-3">
                {selectedPokemon.name}
              </h2>

              {/* Tabs */}
              <nav className="flex w-full justify-around border-b-4 border-pink-700 mb-4">
                {["stats", "details", "moves", "more-info"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-2 text-center font-semibold ${
                      activeTab === tab
                        ? "text-white bg-pink-700 rounded-t-lg"
                        : "text-pink-700 hover:bg-pink-600 hover:text-white"
                    } transition`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1).replace("-", " ")}
                  </button>
                ))}
              </nav>

              <div className="w-full min-h-[220px] px-2">
                {activeTab === "stats" && (
                  <>
                    <div>
                      {selectedPokemon.stats.map(({ stat, base_stat }) => (
                        <StatBar
                          key={stat.name}
                          label={stat.name.replace("-", " ")}
                          value={base_stat}
                          max={MAX_STAT_VALUE}
                        />
                      ))}
                    </div>
                    <div className="mt-6">
                      <h4 className="text-lg font-semibold text-pink-700 mb-2">
                        Sound of Pokémon
                      </h4>
                      <audio
                        controls
                        className="w-full rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-pink-400"
                      >
                        <source
                          src={`https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${selectedPokemon.id}.ogg`}
                          type="audio/ogg"
                        />
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  </>
                )}

                {activeTab === "details" && (
                  <div className="space-y-2 text-gray-800">
                    <p>
                      <strong>Base Experience:</strong>{" "}
                      {selectedPokemon.base_experience}
                    </p>
                    <p>
                      <strong>Height:</strong> {selectedPokemon.height}
                    </p>
                    <p>
                      <strong>Weight:</strong> {selectedPokemon.weight}
                    </p>
                    <p className="capitalize">
                      <strong>Abilities:</strong>{" "}
                      {selectedPokemon.abilities
                        .map((a) => a.ability.name)
                        .join(", ")}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selectedPokemon.types.map(({ type }) => (
                        <span
                          key={type.name}
                          className="px-3 py-1 rounded-full bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-700 text-white font-semibold capitalize shadow-lg"
                        >
                          {type.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "moves" && (
                  <div className="max-h-48 overflow-y-auto text-gray-800 text-base">
                    <h3 className="font-semibold mb-2">Moves (First 20):</h3>
                    <ul className="list-disc list-inside space-y-1 max-h-48 overflow-y-auto">
                      {selectedPokemon.moves.slice(0, 20).map(({ move }) => (
                        <li key={move.name} className="capitalize">
                          {move.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeTab === "more-info" && (
                  <div className="text-gray-800">
                    <h3 className="font-semibold mb-2">More Info</h3>
                    <p>
                      <strong>Habitat:</strong>{" "}
                      {selectedSpecies.habitat
                        ? selectedSpecies.habitat.name.charAt(0).toUpperCase() +
                          selectedSpecies.habitat.name.slice(1)
                        : "Unknown"}
                    </p>
                    <p>
                      <strong>Generation:</strong>{" "}
                      {selectedSpecies.generation.name
                        .replace("generation-", "Generation ")
                        .toUpperCase()}
                    </p>
                    <p>
                      <strong>Growth Rate:</strong>{" "}
                      {selectedSpecies.growth_rate.name
                        .replace("-", " ")
                        .toUpperCase()}
                    </p>
                    <p>
                      <strong>Color:</strong>{" "}
                      {selectedSpecies.color.name.charAt(0).toUpperCase() +
                        selectedSpecies.color.name.slice(1)}
                    </p>
                    <p>
                      <strong>Egg Groups:</strong>{" "}
                      {selectedSpecies.egg_groups
                        .map(
                          (group) =>
                            group.name.charAt(0).toUpperCase() + group.name.slice(1)
                        )
                        .join(", ")}
                    </p>
                    <p>
                      <strong>Shape:</strong>{" "}
                      {selectedSpecies.shape.name.charAt(0).toUpperCase() +
                        selectedSpecies.shape.name.slice(1)}
                    </p>
                    <p className="mt-4 italic text-sm">
                      Note: More info is from the Pokémon species endpoint.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
