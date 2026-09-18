import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './components/Home.tsx'
import Navbar from './components/Navbar.tsx'
import LazySchedulePage from './pages/LazySchedulePage.tsx'
import ProductivityPage from './pages/ProductivityPage.tsx'

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lazy-schedule" element={<LazySchedulePage />} />
          <Route path="/productivity" element={<ProductivityPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App