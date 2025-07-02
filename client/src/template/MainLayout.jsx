import { useState } from 'react'
import { NavBar } from '../components/nav/NavBar'
import { SideNavBar } from '../components/nav/SideNavBar'
import styles from "./MainLayout.module.css";

import { motion, AnimatePresence } from 'motion/react'

function MainLayout({ children }) {
    const [sidebarActive, setSidebarActive] = useState(false)

    function toggleSideNav() {
        setSidebarActive(!sidebarActive)
    }

    return (
        <div className={styles.Main}>
            {sidebarActive && 
                <AnimatePresence>
                    <motion.div
                        key='sidebar'
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <SideNavBar username={'Yippee'} toggleSideNav={toggleSideNav} position='officer'/>
                    </motion.div>
                </AnimatePresence>
            }
            <NavBar username={'Yippee'} toggleSideNav={toggleSideNav} />
            {/* places "pages" here */}
            { children }
        </div>
        

    )
}

export default MainLayout