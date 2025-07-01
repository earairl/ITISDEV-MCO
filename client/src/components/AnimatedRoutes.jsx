import { Routes, Route, Link, useLocation } from "react-router-dom"

import AuthPage from '../pages/AuthPage'
import HomePage from '../pages/HomePage'
import NotFoundPage from '../pages/NotFoundPage'

import { AnimatePresence } from 'motion/react'

function AnimatedRoutes() {
    const location = useLocation()
    return (
        <AnimatePresence>
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<AuthPage />} />
                <Route path="/home" element={<HomePage />} />
                {/* <Route path="/game-details" element={<GamePage />} /> */}
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </AnimatePresence>
    )
}

export default AnimatedRoutes