import { useState } from 'react'
import { NavBar } from '../components/nav/NavBar'
import { SideNavBar } from '../components/nav/SideNavBar'

import { motion, AnimatePresence } from 'motion/react'

function MainLayout({ children }) {
    const [sidebarActive, setSidebarActive] = useState(false)

    function toggleSideNav() {
        setSidebarActive(!sidebarActive)
    }

    return (
        // <div className="bg-blue-500">
        //     <header className='w-auto h-20 bg-green-400 flex flex-col'>
        //         <nav>
        //             <ul>
        //                 <li>Home</li>
        //                 <li>Profile</li>
        //                 <li>Games</li>
        //             </ul>
        //         </nav>
        //     </header>
        //     <div>
        //         {children}
        //     </div>
        // </div>

        <div className='min-w-screen min-h-screen'>
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
            {/* place "pages" here */}
        </div>

    )
}

export default MainLayout