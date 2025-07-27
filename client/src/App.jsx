import { BrowserRouter as Router, Link } from "react-router-dom"
import { Toaster } from '@/components/ui/Toaster'
// BrowserRouter uses alias Router

import AnimatedRoutes from './components/AnimatedRoutes'

import { UserProvider } from '@/components/UserProvider'

function App() {
  return (
      <Toaster>
        <Router>
          <UserProvider>
            <AnimatedRoutes />
          </UserProvider>
        </Router>
      </Toaster>
  )
}

export default App
