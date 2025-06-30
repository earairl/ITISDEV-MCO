import { useState } from 'react'
import { NavBar } from '../components/NavBar'
import { SideNavBar } from '../components/SideNavBar'

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

        <>
            {sidebarActive && <SideNavBar toggleSideNav={toggleSideNav} position='officer'/>}

            <NavBar username={'Yippee'} toggleSideNav={toggleSideNav} />
        </>
    )
}

export default MainLayout