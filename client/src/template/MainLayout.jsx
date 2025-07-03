import { useState } from 'react'
import { useLocation, Outlet } from 'react-router-dom'
import { NavBar } from '../components/nav/NavBar'
import { SideNavBar } from '../components/nav/SideNavBar'
import styles from "./MainLayout.module.css";

import { motion, AnimatePresence } from 'motion/react'

function MainLayout({ children }) {
    const [sidebarActive, setSidebarActive] = useState(false)
    const userInfo = sessionStorage.getItem('user');
    const user = userInfo ? JSON.parse(userInfo) : { username: 'guest', position: 'guest' };

    const location = useLocation()
    const isFromAuthPage = location.state?.fromAuth || false
    const shouldFade = isFromAuthPage || location.pathname === '/auth'

    function toggleSideNav() {
        setSidebarActive(!sidebarActive)
    }

    return (
        <motion.div
            className={styles.Main}

            initial={shouldFade ? { opacity: 0 } : false}
            animate={shouldFade ? { opacity: 1 } : false}
            exit={shouldFade ? { opacity: 0 } : false}
        >
            <AnimatePresence>
                {sidebarActive && 
                    <>
                        <motion.div 
                            className={styles.backdrop} 

                            key='backdrop'
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={toggleSideNav}
                        />

                        <motion.div
                            className={styles.sideNavWrap}

                            key='sidebar'
                            initial={{ x: -500 }} 
                            animate={{ x: -15 }} 
                            exit={{ x: -500 }}
                            transition={{ duration: 0.6, ease: 'easeInOut', type: 'spring', bounce: 0.2 }}
                        >
                            <SideNavBar username={user.username} toggleSideNav={toggleSideNav} position={user.position} />
                        </motion.div>
                    </> 
                }
            </AnimatePresence>
            
            <NavBar username={user.username} position={user.position} toggleSideNav={toggleSideNav} />

            {/* places "pages" here */}
            <Outlet />
        </motion.div>
    )
}

export default MainLayout