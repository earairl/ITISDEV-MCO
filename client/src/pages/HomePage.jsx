import MainLayout from "@/template/MainLayout"
import NotifModal from "@/components/ui/NotifModal"
import { motion } from 'motion/react'

function HomePage() {
    return (
        <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
        >
            <MainLayout>
                <h1 className='text-green-300'>HOMEPAGE</h1>
                <NotifModal></NotifModal>
            </MainLayout>    
        </motion.div>
    )
}

export default HomePage