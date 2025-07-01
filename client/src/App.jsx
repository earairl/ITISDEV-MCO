import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
// BrowserRouter uses alias Router
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import NotFoundPage from "./pages/NotFoundPage"
//import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        {/* <Route path="/game-details" element={<GamePage />} /> */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  )
}

export default App
