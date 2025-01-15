import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/taisei2/" element={<Home />} />
        <Route path="/taisei2/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
