import { useState, useEffect, useMemo, useCallback } from 'react';

export const usePokemonFilters = (allPokemons, speciesData, typesData) => {
  const [filterTab, setFilterTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState(null);
  const [displayedPokemons, setDisplayedPokemons] = useState([]);

  const filteredPokemons = useMemo(() => {
    if (filterTab === "type") return displayedPokemons;
    
    let filtered = allPokemons;
    if (filterTab === "legendary") {
      filtered = filtered.filter(p => speciesData[p.name]?.is_legendary);
    } else if (filterTab === "mythical") {
      filtered = filtered.filter(p => speciesData[p.name]?.is_mythical);
    } else if (filterTab === "mega") {
      filtered = filtered.filter(p => p.name.toLowerCase().endsWith("-mega"));
    } else if (filterTab === "gmax") {
      filtered = filtered.filter(p => p.name.toLowerCase().endsWith("-gmax"));
    }
    if (searchTerm.trim()) {
      filtered = filtered.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    return filtered;
  }, [filterTab, searchTerm, allPokemons, speciesData, displayedPokemons]);

  const updateTypeFilter = useCallback(async (type) => {
    if (typesData[type]) {
      const res = await fetch(typesData[type]);
      const data = await res.json();
      const typePokemonNames = data.pokemon.map(p => p.pokemon.name);
      let filteredByType = allPokemons.filter(p => typePokemonNames.includes(p.name));
      if (searchTerm.trim()) {
        filteredByType = filteredByType.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
      }
      return { data, filteredPokemons: filteredByType };
    }
    return null;
  }, [allPokemons, typesData, searchTerm]);

  return {
    filterTab,
    setFilterTab,
    searchTerm,
    setSearchTerm,
    selectedType,
    setSelectedType,
    displayedPokemons,
    setDisplayedPokemons,
    filteredPokemons,
    updateTypeFilter
  };
};
