import { BrowserRouter, Routes, Route } from 'react-router-dom'
import TitleScreen from './pages/TitleScreen'
import BattleScreen from './pages/BattleScreen'
import Clear from './pages/Clear'
import GameOver from './pages/GameOver'
import TreasureList from './pages/TreasureList'
import TreasureDetail from './pages/TreasureDetail'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/taisei2/" element={<TitleScreen />} />
        <Route path="/taisei2/battle" element={<BattleScreen />} />
        <Route path="/taisei2/clear" element={<Clear />} />
        <Route path="/taisei2/gameover" element={<GameOver />} />
        <Route path="/taisei2/treasure" element={<TreasureList />} />
        <Route path="/taisei2/treasure/:id" element={<TreasureDetail />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
