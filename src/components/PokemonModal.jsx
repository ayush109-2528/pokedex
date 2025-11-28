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