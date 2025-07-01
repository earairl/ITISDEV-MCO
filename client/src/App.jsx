import { BrowserRouter as Router, Link } from "react-router-dom"
// BrowserRouter uses alias Router

//import './App.css'
import AnimatedRoutes from './components/AnimatedRoutes'

function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  )
}

export default App
