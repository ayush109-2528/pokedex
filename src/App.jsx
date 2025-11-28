import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Pokedex from './pages/pokedex';
import PokemonDetail from './pages/PokemonDetails';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pokedex/*" element={<Pokedex />} />
        <Route path="/pokemon/:name" element={<PokemonDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
