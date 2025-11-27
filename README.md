Pokédex - React + Vite

A fully responsive Pokédex built with React, Vite, and Tailwind CSS using the PokeAPI. Features glitter-animated cards, advanced filtering, hover stats, and Pokémon trading card-style modals.

 ✨ Features

    Responsive Design: Mobile-first layout (1-5 columns based on screen size)

    Glitter Animations: Unique effects for Legendary (gold), Mythical (rainbow), Rare (blue), Default (pink)

    Advanced Filtering: All, Legendary, Mythical, Mega Evolutions (-mega suffix), Type dropdown

    Search: Real-time Pokémon name search

    Hover Stats: HP, Attack, Defense overlay on cards

    Trading Card Modal: Stats, Details, Moves, More Info tabs

    Pokémon Cries: Audio player labeled "Sound of Pokémon" 

    Total Count: Live Pokémon counter (1,118 total)

    Performance: Cached stats, optimized API calls

🛠 Tech Stack

    Frontend: React 18, Vite, Tailwind CSS

    API: PokeAPI v2 (Pokémon, Species, Types, Cries)

    Styling: Tailwind CSS + Custom CSS animations

    Deployment: Vercel, Netlify, GitHub Pages

    Node.js 18+

    npm or yarn

Installation

bash
# Clone the repo
git clone https://github.com/yourusername/pokedex-react-vite.git
cd pokedex-react-vite

# Install dependencies
npm install

# Run development server
npm run dev

App will be available at http://localhost:5173
Build for Production

bash
npm run build
npm run preview

🗂 Project Structure

text
pokedex-react-vite/
├── public/
├── src/
│   ├── App.jsx              # Main Pokédex component
│   ├── index.css            # Global styles + glitter animations
│   └── main.jsx             # Entry point
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json

🎨 Customization
Glitter Effects

Edit index.css for custom animations:

css
.glitter-gold     /* Legendary Pokémon */
.glitter-mythical /* Mythical Pokémon */
.glitter-blue     /* Rare (HP > 150) */
.glitter-default  /* Common Pokémon */

Filters

Modify FILTER_TABS array in App.jsx:

jsx
const FILTER_TABS = [
  { key: "all", label: "All" },
  { key: "legendary", label: "Legendary" },
  // Add custom filters here
];

🔍 API Endpoints Used

    https://pokeapi.co/api/v2/pokemon?limit=1118 - All Pokémon

    https://pokeapi.co/api/v2/pokemon/{id} - Pokémon details

    https://pokeapi.co/api/v2/pokemon-species/{id} - Species data

    https://pokeapi.co/api/v2/type - Pokémon types

    https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/{id}.ogg - Pokémon cries

📱 Responsive Breakpoints
Breakpoint	Columns	Description
xs (<640px)	1	Mobile portrait
sm (640px+)	2	Mobile landscape
md (768px+)	3	Tablet
lg (1024px+)	5	Desktop
⚡ Performance Optimizations

    ✅ Cached species data (1,118 Pokémon)

    ✅ Cached basic stats (hover performance)

    ✅ Debounced search

    ✅ Lazy-loaded modal details

    ✅ Optimized sprite URLs

    ✅ Minimal re-renders

🚀 Deployment
Vercel (Recommended)

bash
npm i -g vercel
vercel --prod

Netlify

Drag dist folder to netlify.com/drop
GitHub Pages

bash
npm install -g gh-pages
npm run deploy

🤝 Contributing

    Fork the project

    Create your feature branch (git checkout -b feature/AmazingFeature)

    Commit your changes (git commit -m 'Add some AmazingFeature')

    Push to the branch (git push origin feature/AmazingFeature)

    Open a Pull Request

🙌 Acknowledgments

    PokeAPI - Amazing free Pokémon API

    Tailwind CSS - Rapid UI development

    Vite - Lightning-fast builds

<div align="center">

⭐ Star on GitHub · Built with ❤️ for Pokémon fans
</div>

Made with React + Vite + Tailwind CSS
Gotta catch 'em all! 🏆
