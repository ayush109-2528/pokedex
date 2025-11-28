import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 flex flex-col items-center justify-center text-white px-4 text-center">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black bg-gradient-to-r from-white via-yellow-200 to-pink-200 bg-clip-text text-transparent drop-shadow-4xl leading-tight">
            Pokédex
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl font-bold opacity-90 max-w-2xl mx-auto leading-relaxed">
            Complete Pokémon database with advanced filtering, type matchups, and abilities
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
          <Link
            to="/pokedex"
            className="group w-full sm:w-auto px-12 py-6 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 text-white text-xl font-black rounded-3xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 transform hover:-translate-y-1 border-4 border-white/20 flex items-center justify-center gap-3 text-lg"
          >
            <span className="w-8 h-8 bg-white/20 rounded-2xl flex items-center justify-center group-hover:rotate-180 transition-transform">
              🚀
            </span>
            Explore Pokédex
          </Link>
          <Link
            to="/pokedex?tab=legendary"
            className="group w-full sm:w-auto px-8 py-5 bg-white/20 backdrop-blur-xl text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:bg-white/40 hover:scale-105 transition-all duration-300 border-2 border-white/30 flex items-center justify-center gap-2 text-base"
          >
            ⭐ Legendary
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 opacity-80">
          <div className="p-6 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20">
            <div className="text-3xl mb-2">🔥</div>
            <h3 className="text-xl font-bold mb-1">18 Types</h3>
            <p className="text-sm">Complete type matchups</p>
          </div>
          <div className="p-6 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20">
            <div className="text-3xl mb-2">⭐</div>
            <h3 className="text-xl font-bold mb-1">1000+ Pokémon</h3>
            <p className="text-sm">All generations included</p>
          </div>
          <div className="p-6 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20">
            <div className="text-3xl mb-2">🛡️</div>
            <h3 className="text-xl font-bold mb-1">270+ Abilities</h3>
            <p className="text-sm">Detailed ability data</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
