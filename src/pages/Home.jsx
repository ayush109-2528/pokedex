import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import PokemonCard from "../components/PokemonCard";
import { usePokemonData } from "../hooks/usePokemonData";

const FILTER_TABS = [
  { key: "all", label: "All" },
  { key: "legendary", label: "Legendary" },
  { key: "mythical", label: "Mythical" },
  { key: "mega", label: "Mega Evolutions" },
  { key: "gmax", label: "Gigantamax" },
  { key: "type", label: "Type" },
];

const Home = () => {
  const {
    allPokemons,
    speciesData,
    megaSprites,
    typesData,
    basicStats,
    setBasicStats,
    loading,
  } = usePokemonData();
  const [displayedPokemons, setDisplayedPokemons] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [currentTypeData, setCurrentTypeData] = useState(null);
  const [filterTab, setFilterTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showTypeDetails, setShowTypeDetails] = useState(true);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const searchTimeoutRef = useRef(null);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // ... keep all existing filter logic (same as before)

  const filteredPokemons = useMemo(() => {
    if (filterTab === "type") return displayedPokemons;

    let filtered = allPokemons;
    if (filterTab === "legendary") {
      filtered = filtered.filter((p) => speciesData[p.name]?.is_legendary);
    } else if (filterTab === "mythical") {
      filtered = filtered.filter((p) => speciesData[p.name]?.is_mythical);
    } else if (filterTab === "mega") {
      filtered = filtered.filter((p) => p.name.toLowerCase().endsWith("-mega"));
    } else if (filterTab === "gmax") {
      filtered = filtered.filter((p) => p.name.toLowerCase().endsWith("-gmax"));
    }
    if (searchTerm.trim()) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return filtered;
  }, [filterTab, searchTerm, allPokemons, speciesData, displayedPokemons]);

  useEffect(() => {
    if (filterTab === "type" && selectedType && typesData[selectedType]) {
      fetch(typesData[selectedType])
        .then((res) => res.json())
        .then((data) => {
          setCurrentTypeData(data);
          const typePokemonNames = data.pokemon.map((p) => p.pokemon.name);
          let filteredByType = allPokemons.filter((p) =>
            typePokemonNames.includes(p.name)
          );
          if (searchTerm.trim()) {
            filteredByType = filteredByType.filter((p) =>
              p.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
          }
          setDisplayedPokemons(filteredByType);
        })
        .catch((err) => console.error("Error fetching type:", err));
    } else {
      setCurrentTypeData(null);
      setDisplayedPokemons(filteredPokemons);
    }
  }, [
    filterTab,
    selectedType,
    searchTerm,
    allPokemons,
    typesData,
    filteredPokemons,
  ]);

  useEffect(() => {
    const handleScroll = () => setShowScrollToTop(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const scrollToTypeDetails = () =>
    document
      .getElementById("type-detail-panel")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });

  const handleSearchChange = (e) => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    setSearchTerm(e.target.value);
    searchTimeoutRef.current = setTimeout(() => {}, 300);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-tr from-purple-600 via-pink-600 to-red-600 flex items-center justify-center p-8">
        <div className="text-white text-2xl font-bold animate-pulse flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full animate-spin"></div>
          Loading Pokédex...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 text-gray-900 relative overflow-hidden">
      {/* ✨ FIXED HEADER - PERFECTLY ALIGNED */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-purple-600/95 via-pink-600/95 to-orange-500/95 backdrop-blur-2xl border-b-4 border-pink-500/60 shadow-2xl">
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-3 sm:py-4">
          {/* Header Row - Perfectly centered */}
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black bg-gradient-to-r from-white via-pink-100 to-orange-100 bg-clip-text text-transparent drop-shadow-2xl">
                Pokédex
              </h1>
              <span className="w-1.5 h-6 sm:h-8 bg-gradient-to-b from-yellow-400 via-orange-400 to-red-500 rounded-full animate-pulse shadow-lg"></span>
            </div>
            <div className="text-white/90 font-bold text-xs sm:text-sm lg:text-base bg-black/20 px-2 sm:px-3 py-1 rounded-full shadow-lg">
              {allPokemons.length} Pokémon
            </div>
          </div>

          {/* Controls Row - Perfect alignment */}
          <div className="flex items-center gap-2 sm:gap-3 h-12 sm:h-14">
            {/* Filter Tabs - Scrollable on mobile */}
            <div className="flex gap-1 sm:gap-2 flex-1 min-w-0 overflow-x-auto pb-1 -mb-1 scrollbar-hide">
              {FILTER_TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => {
                    setFilterTab(tab.key);
                    if (tab.key !== "type") setSelectedType(null);
                    setShowSearch(false);
                    scrollToTop();
                  }}
                  className={`px-2.5 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-full font-bold text-white uppercase tracking-wider text-xs sm:text-sm transition-all duration-300 flex-shrink-0 shadow-lg backdrop-blur-sm whitespace-nowrap ${
                    filterTab === tab.key
                      ? "bg-gradient-to-r from-pink-600 to-purple-600 scale-105 ring-4 ring-pink-400/50 shadow-pink-500/50 glitter-gold"
                      : "bg-white/20 hover:bg-pink-500/80 hover:scale-105 hover:shadow-2xl hover:shadow-pink-500/30"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Type Select - Only on desktop */}
            {!isMobile && filterTab === "type" && (
              <select
                className="px-3 py-2 rounded-xl font-bold text-gray-900 text-sm bg-white/90 shadow-xl focus:outline-none focus:ring-4 focus:ring-pink-500/50 backdrop-blur-sm border border-pink-300/50 min-w-[120px] h-11"
                onChange={(e) => {
                  setSelectedType(e.target.value);
                  scrollToTop();
                }}
                value={selectedType || ""}
              >
                <option value="" disabled>
                  Select Type
                </option>
                {Object.keys(typesData)
                  .sort()
                  .map((type) => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
              </select>
            )}

            {/* 🔍 Search - Right aligned */}
            <div className="flex items-center ml-auto">
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="p-1.5 sm:p-2.5 rounded-2xl bg-white/20 hover:bg-white/40 backdrop-blur-sm shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 border-2 border-white/30 group relative overflow-hidden flex-shrink-0 w-11 sm:w-12 h-11 sm:h-12"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-white group-hover:scale-110 transition-transform mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                {showSearch && (
                  <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-purple-500 blur opacity-75 animate-ping"></div>
                )}
              </button>
              {showSearch && (
                <input
                  type="text"
                  placeholder="Search..."
                  className="ml-2 w-28 sm:w-40 md:w-56 lg:w-72 px-3 py-2 rounded-2xl font-bold shadow-2xl focus:outline-none focus:ring-4 focus:ring-pink-500/50 bg-white/95 backdrop-blur-xl border-2 border-pink-300/50 text-sm transition-all duration-300 h-11"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  autoFocus
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-28 sm:pt-36 lg:pt-44 pb-24">
        {/* ✨ TYPE HEADER - PERFECTLY CENTERED */}
        {filterTab === "type" && currentTypeData && selectedType && (
          <div className="mb-8 p-6 sm:p-8 max-w-6xl mx-auto bg-gradient-to-r from-white/95 via-pink-50/90 to-purple-50/90 backdrop-blur-xl rounded-3xl shadow-2xl border-4 border-pink-500/60 sticky top-4 z-20 animate-fade-in">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl font-bold text-white capitalize">
                    {selectedType[0]}
                  </span>
                </div>
                <div>
                  <h2 className="text-4xl lg:text-5xl font-black capitalize bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-2xl">
                    {selectedType} Type
                  </h2>

                  <p className="text-xl text-gray-700 font-semibold mt-1">
                    {currentTypeData.pokemon.length} Pokémon •
                    {currentTypeData.moves.length} Moves
                  </p>
                </div>
              </div>

              <div className="flex gap-3 flex-wrap">
                <button
                  className="px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl shadow-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 ring-2 ring-pink-400"
                  onClick={() =>
                    document
                      .getElementById("type-detail-panel")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  ↓ View Full Details
                </button>

                <button
                  className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                  onClick={() => setShowTypeDetails(!showTypeDetails)}
                >
                  {showTypeDetails ? "− Hide Details" : "+ Show Details"}
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Pokémon Grid */}
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6 mb-12 lg:mb-16">
            {displayedPokemons.length === 0 ? (
              <div className="col-span-full text-center text-white py-20 lg:py-24">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-black mb-6 bg-gradient-to-r from-white to-pink-100 bg-clip-text drop-shadow-2xl">
                  No Pokémon Found
                </div>
                <p className="text-lg sm:text-xl lg:text-2xl opacity-90 font-semibold">
                  Try different filters!
                </p>
              </div>
            ) : (
              displayedPokemons.map((pokemon) => (
                <PokemonCard
                  key={pokemon.name}
                  pokemon={pokemon}
                  speciesData={speciesData}
                  megaSprites={megaSprites}
                  basicStats={basicStats}
                  setBasicStats={setBasicStats}
                  filterTab={filterTab}
                />
              ))
            )}
          </div>
        </div>

        {/* 📊 FULL TYPE DETAILS - Mobile toggle only */}
        {filterTab === "type" &&
          currentTypeData &&
          selectedType &&
          showTypeDetails && (
            <section
              id="type-detail-panel"
              className="px-4 sm:px-6 lg:px-8 pb-24"
            >
              <div className="max-w-7xl mx-auto space-y-8 lg:space-y-12">
                {/* Damage Relations - Perfectly aligned grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                  <div>
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-800 mb-6 lg:mb-10 flex items-center gap-3 justify-center lg:justify-start">
                      <span className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-sm sm:text-base shrink-0">
                        ⚡
                      </span>
                      <span>Takes Damage From</span>
                    </h3>
                    <div className="space-y-4">
                      <DamageRelationRow
                        label="Double Damage From"
                        types={
                          currentTypeData.damage_relations.double_damage_from
                        }
                      />
                      <DamageRelationRow
                        label="Half Damage From"
                        types={
                          currentTypeData.damage_relations.half_damage_from
                        }
                        variant="half"
                      />
                      <DamageRelationRow
                        label="No Damage From"
                        types={currentTypeData.damage_relations.no_damage_from}
                        variant="immune"
                      />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-800 mb-6 lg:mb-10 flex items-center gap-3 justify-center lg:justify-start">
                      <span className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-white font-bold text-sm sm:text-base shrink-0">
                        🛡️
                      </span>
                      <span>Deals Damage To</span>
                    </h3>
                    <div className="space-y-4">
                      <DamageRelationRow
                        label="Double Damage To"
                        types={
                          currentTypeData.damage_relations.double_damage_to
                        }
                      />
                      <DamageRelationRow
                        label="Half Damage To"
                        types={currentTypeData.damage_relations.half_damage_to}
                        variant="half"
                      />
                      <DamageRelationRow
                        label="No Damage To"
                        types={currentTypeData.damage_relations.no_damage_to}
                        variant="immune"
                      />
                    </div>
                  </div>
                </div>

           
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-6 sm:p-8 bg-gradient-to-r from-pink-100/50 to-purple-100/50 rounded-3xl border-4 border-white/50 shadow-2xl">
                  <div className="text-center">
                    <div className="text-4xl sm:text-5xl font-black text-pink-600 mb-3 drop-shadow-xl">
                      {currentTypeData.pokemon.length}
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-gray-800">
                      Total Pokémon
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl sm:text-5xl font-black text-blue-600 mb-3 drop-shadow-xl">
                      {currentTypeData.moves.length}
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-gray-800">
                      Moves
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl sm:text-5xl font-black text-purple-600 mb-3 drop-shadow-xl">
                      {currentTypeData.generation?.name.replace(
                        "generation-",
                        "Gen "
                      )}
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-gray-800">
                      Introduced
                    </div>
                  </div>
                </div>

                {/* Moves & Pokémon - Perfect responsive */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                  <div className="p-6 sm:p-8 bg-gradient-to-br from-blue-50/80 to-indigo-50/80 rounded-3xl shadow-2xl border border-blue-200/50">
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-800 mb-6 flex items-center gap-3 justify-center lg:justify-start">
                      <span className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg shrink-0">
                        ✨
                      </span>
                      Signature Moves
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 max-h-48 lg:max-h-60 overflow-y-auto p-4 sm:p-6 rounded-2xl bg-white/50">
                      {currentTypeData.moves.slice(0, 16).map((move) => (
                        <span
                          key={move.name}
                          className="capitalize bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-xl text-xs sm:text-sm font-bold text-center hover:from-blue-600 hover:scale-105 transition-all shadow-lg cursor-default"
                        >
                          {move.name
                            .replace(/-/g, " ")
                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="p-6 sm:p-8 bg-gradient-to-br from-pink-50/80 to-purple-50/80 rounded-3xl shadow-2xl border border-pink-200/50">
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-800 mb-6 flex items-center gap-3 justify-center lg:justify-start">
                      <span className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg shrink-0">
                        ⭐
                      </span>
                      Featured Pokémon
                    </h3>
                    <div className="flex flex-wrap gap-2 sm:gap-3 max-h-48 lg:max-h-60 overflow-y-auto p-4 sm:p-6 rounded-2xl bg-white/50">
                      {currentTypeData.pokemon
                        .slice(0, 24)
                        .map(({ pokemon }) => (
                          <span
                            key={pokemon.name}
                            className="capitalize bg-gradient-to-r from-pink-500 to-purple-600 text-white px-3 py-2 rounded-xl text-xs sm:text-sm font-bold cursor-pointer hover:from-pink-600 hover:scale-105 transition-all shadow-md hover:shadow-lg whitespace-nowrap"
                            onClick={() => navigate(`/pokemon/${pokemon.name}`)}
                            title={`View ${pokemon.name}`}
                          >
                            {pokemon.name
                              .replace(/-/g, " ")
                              .replace(/\b\w/g, (l) => l.toUpperCase())}
                          </span>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}
      </div>

      {/* 🚀 Mobile FAB */}
      {showScrollToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 text-white rounded-3xl shadow-3xl hover:shadow-4xl hover:scale-110 transition-all duration-300 border-4 border-white/40 flex items-center justify-center text-xl sm:text-2xl font-bold animate-pulse"
          aria-label="Back to top"
        >
          ↑
        </button>
      )}
    </div>
  );
};

// Fixed DamageRelationRow with perfect alignment
const DamageRelationRow = ({ label, types, variant = "double" }) => {
  if (!types?.length) return null;

  const styles = {
    double: { bg: "from-red-500 to-orange-500", icon: "⚡", multiplier: "2x" },
    half: { bg: "from-emerald-500 to-green-500", icon: "🛡️", multiplier: "½x" },
    immune: { bg: "from-gray-500 to-slate-500", icon: "🚫", multiplier: "0x" },
  };
  const { bg, icon, multiplier } = styles[variant] || styles.double;

  return (
    <div className="p-5 sm:p-6 lg:p-8 bg-gradient-to-r bg-white/80 rounded-2xl lg:rounded-3xl shadow-xl border-l-4 lg:border-l-8 border-pink-400/60 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-center justify-between sm:justify-start sm:gap-4 mb-4 sm:mb-6 flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <span className="text-xl sm:text-2xl lg:text-3xl shrink-0">
            {icon}
          </span>
          <h4 className="text-lg sm:text-xl lg:text-2xl font-black text-gray-800 capitalize">
            {label}
          </h4>
        </div>
        <span className="px-3 py-1 sm:px-4 sm:py-2 bg-gradient-to-r from-white/90 to-transparent rounded-xl lg:rounded-2xl text-lg sm:text-xl font-black text-gray-900 shadow-lg shrink-0">
          {multiplier}
        </span>
      </div>
      <div className="flex flex-wrap gap-2 sm:gap-3 lg:gap-4 justify-center sm:justify-start">
        {types.map((type) => (
          <span
            key={type.name}
            className={`capitalize px-4 sm:px-5 lg:px-6 py-2 sm:py-3 lg:py-4 rounded-xl lg:rounded-2xl font-bold text-white shadow-lg bg-gradient-to-r ${bg} text-sm sm:text-base hover:scale-105 hover:shadow-xl transition-all duration-300 cursor-pointer`}
          >
            {type.name
              .replace(/-/g, " ")
              .replace(/\b\w/g, (l) => l.toUpperCase())}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Home;
