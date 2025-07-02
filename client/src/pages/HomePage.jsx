import MainLayout from "@/template/MainLayout"
import { motion } from 'motion/react'
/* Radix UI */
import ToggleSwitch from "@/components/ui/ToggleSwitch"
import UserAvatar from "@/components/ui/UserAvatar"
import NotifModal from "@/components/ui/NotifModal"
import ScrollableArea from "@/components/ui/ScrollableArea"

function HomePage() {
    return (
        <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
        >
            <MainLayout>               
                {/* Inline style for testing only */}
                <div style={{backgroundColor: "lightyellow", padding: "2rem"}}>
                    {/* Sample UI Comps */}
                    <ToggleSwitch btnLabel="sample" btnName="Sample Toggle"></ToggleSwitch>
                    <UserAvatar userImg="https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80" initials="TadadsD"></UserAvatar>
                    <NotifModal></NotifModal>
                    <ScrollableArea tabName="Sample Scroll Area"></ScrollableArea>
                </div>
            </MainLayout>    
        </motion.div>
    )
}

export default HomePage