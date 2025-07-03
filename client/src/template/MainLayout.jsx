import { useState } from 'react'
import { NavBar } from '../components/nav/NavBar'
import { SideNavBar } from '../components/nav/SideNavBar'
import styles from "./MainLayout.module.css";

import { motion, AnimatePresence } from 'motion/react'

function MainLayout({ children }) {
    const [sidebarActive, setSidebarActive] = useState(false)
    const userRaw = sessionStorage.getItem('user');
    const user = userRaw ? JSON.parse(userRaw) : null;

    function toggleSideNav() {
        setSidebarActive(!sidebarActive)
    }

    return (
        <div className={styles.Main}>
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
                            <SideNavBar username={user.username} toggleSideNav={toggleSideNav} position={user.position}/>
                        </motion.div>
                    </> 
                }
            </AnimatePresence>
            
            <NavBar username={user.username} toggleSideNav={toggleSideNav} />
            {/* places "pages" here */}
            { children }
        </div>
        

    )
}

export default MainLayout