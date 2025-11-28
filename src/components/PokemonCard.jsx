import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PokemonCard = ({ pokemon, speciesData, megaSprites, basicStats, setBasicStats, filterTab }) => {
  const [stats, setStats] = useState({});
  const navigate = useNavigate();

  const BASIC_STATS = ["hp", "attack", "defense"];
  const fetchBasicStats = (url, name) => {
    if (basicStats[name]) return;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const statsData = {};
        data.stats.forEach(({ stat, base_stat }) => {
          if (BASIC_STATS.includes(stat.name)) {
            statsData[stat.name] = base_stat;
          }
        });
        setBasicStats(prev => ({ ...prev, [name]: statsData }));
        setStats(statsData);
      });
  };

  const getGlitterClass = (name) => {
    if (!speciesData[name]) return "glitter-default";
    if (speciesData[name].is_legendary) return "glitter-gold";
    if (speciesData[name].is_mythical) return "glitter-mythical";
    if (basicStats[name]?.hp > 150) return "glitter-blue";
    return "glitter-default";
  };

  const getSpriteUrl = (name, pokemonUrl) => {
    if (filterTab === "mega" && megaSprites[name]) return megaSprites[name];
    const id = pokemonUrl.split("/").filter(Boolean).pop();
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
  };

  const { name, url } = pokemon;
  const spriteUrl = getSpriteUrl(name, url);
  const glitterClass = getGlitterClass(name);

  return (
    <div
      className={`${glitterClass} cursor-pointer overflow-hidden flex flex-col items-center px-2 py-3 group relative`}
      onClick={() => navigate(`/pokemon/${name}`)}
      onMouseEnter={() => fetchBasicStats(url, name)}
    >
      <div className="flex justify-center items-center w-full h-32 rounded-lg shadow-lg p-3 bg-white relative z-0">
        <img src={spriteUrl} alt={name} className="max-w-full max-h-full object-contain" />
      </div>
      <div className="mt-3 font-semibold capitalize text-center text-lg tracking-wide text-white drop-shadow-md">
        {name}
      </div>
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
};

export default PokemonCard;
