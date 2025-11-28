import { useEffect, useState } from 'react';

export const usePokemonData = () => {
  const [allPokemons, setAllPokemons] = useState([]);
  const [speciesData, setSpeciesData] = useState({});
  const [megaSprites, setMegaSprites] = useState({});
  const [typesData, setTypesData] = useState({});
  const [basicStats, setBasicStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=10000")
      .then((res) => res.json())
      .then(async (data) => {
        setAllPokemons(data.results);

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
                    sprite: megaData.sprites.other["official-artwork"]?.front_default || megaData.sprites.front_default,
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
          megaForms.forEach((form) => {
            megaSpriteMap[form.name] = form.sprite;
          });
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
        setLoading(false);
      });
  }, []);

  return {
    allPokemons,
    speciesData,
    megaSprites,
    typesData,
    basicStats,
    setBasicStats,
    loading
  };
};
