import { Routes, Route, Link, useLocation } from "react-router-dom"

import AuthPage from '../pages/AuthPage'
import HomePage from '../pages/HomePage'
import ProfilePage from '../pages/ProfilePage'
import MemberDBPage from '../pages/MemberDBPage'
import ViewGamesPage from '../pages/ViewGamesPage'
import GamePage from '../pages/GamePage'
import NotFoundPage from '../pages/NotFoundPage'

import { AnimatePresence } from 'motion/react'
import MainLayout from "../template/MainLayout"

function AnimatedRoutes() {
    const location = useLocation()
    return (
            <AnimatePresence mode='wait'>
                <Routes location={location} key={location.pathname}>
                    <Route path="/" element={<AuthPage />} />

                    {/* routes that use MainLayout */}
                    <Route path='/' element={<MainLayout />}>
                        <Route path="home" element={<HomePage />} />
                        {/* all games view */}
                        <Route path="games" element={<ViewGamesPage />} />
                        {/* replace with <GamePage /> once available */}
                        <Route path="games/:gameId" element={<GamePage />} />
                        <Route path="profile/:username" element={<ProfilePage />} />
                        <Route path="database" element={<MemberDBPage />} />
                        <Route path="notFound" element={<NotFoundPage />} />
                        {/* Global Catch-All */}
                        <Route path="*" element={<NotFoundPage />} />
                    </Route>
                </Routes>
            </AnimatePresence>
    )
}

export default AnimatedRoutes