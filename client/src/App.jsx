import { BrowserRouter as Router, Link } from "react-router-dom"
import { Toaster } from '@/components/ui/Toaster'
// BrowserRouter uses alias Router

import AnimatedRoutes from './components/AnimatedRoutes'

function App() {
  return (
    <Toaster>
      <Router>
        <AnimatedRoutes />
      </Router>
    </Toaster>
  )
}

export default App
