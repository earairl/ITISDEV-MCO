import MainLayout from "@/template/MainLayout"
import { motion } from 'motion/react'
/* Radix UI */
import ToggleSwitch from "@/components/ui/ToggleSwitch"
import UserAvatar from "@/components/ui/UserAvatar"
import NotifModal from "@/components/ui/NotifModal"
import ScrollableArea from "@/components/ui/ScrollableArea"

// implement conditionals to render variations of the page
// e.g. omitting a component if viewed as an officer, public user, etc.
function ProfilePage() {
    return (
        <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
        >
            <MainLayout>               
                <h1 className='text-green-500'>Profile Page</h1>
            </MainLayout>    
        </motion.div>
    )
}

export default ProfilePage