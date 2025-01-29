import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Title from './pages/Title'
import Level from './pages/Level'
import Battle from './pages/Battle'
import Clear from './pages/Clear'
import GameOver from './pages/GameOver'
import Movie from './pages/Movie'
import TreasureList from './pages/TreasureList'
import TreasureDetail from './pages/TreasureDetail'
import KukuLevel from './pages/KukuLevel'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/taisei2/" element={<Title />} />
        <Route path="/taisei2/level" element={<Level />} />
        <Route path="/taisei2/battle" element={<Battle />} />
        <Route path="/taisei2/clear" element={<Clear />} />
        <Route path="/taisei2/gameover" element={<GameOver />} />
        <Route path="/taisei2/movie" element={<Movie />} />
        <Route path="/taisei2/treasure" element={<TreasureList />} />
        <Route path="/taisei2/treasure/:id" element={<TreasureDetail />} />
        <Route path="/taisei2/kuku-level" element={<KukuLevel />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
