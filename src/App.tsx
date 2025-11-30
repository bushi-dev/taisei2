import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Title from './pages/Title';
import Level from './pages/Level';
import EnemyPage from './pages/EnemyPage';
import Clear from './pages/Clear';
import GameOver from './pages/GameOver';
import Movie from './pages/Movie';
import TreasureList from './pages/TreasureList';
import TreasureDetail from './pages/TreasureDetail';
import KukuLevel from './pages/KukuLevel';
import BossPage from './pages/BossPage';
import { BattleProvider } from './context/BattleContext';
import KokugoLevel from './pages/KokugoLevel';
import HistoryLevel from './pages/HistoryLevel';

function App() {
  return (
    <BattleProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Title />} />
          <Route path="/level" element={<Level />} />
          <Route path="/battle" element={<EnemyPage />} />
          <Route path="/boss" element={<BossPage />} />
          <Route path="/clear" element={<Clear />} />
          <Route path="/gameover" element={<GameOver />} />
          <Route path="/movie" element={<Movie />} />
          <Route path="/treasure" element={<TreasureList />} />
          <Route path="/treasure/:id" element={<TreasureDetail />} />
          <Route path="/kuku-level" element={<KukuLevel />} />
          <Route path="/kokugo-level" element={<KokugoLevel />} />
          <Route path="/history-level" element={<HistoryLevel />} />
        </Routes>
      </BrowserRouter>
    </BattleProvider>
  );
}

export default App;
