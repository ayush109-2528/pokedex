import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import PokemonDetail from './pages/PokemonDetails';
import TypeDetail from './pages/TypeDetails';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pokemon/:name" element={<PokemonDetail />} />
        <Route path="/type/:typeName" element={<TypeDetail />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
