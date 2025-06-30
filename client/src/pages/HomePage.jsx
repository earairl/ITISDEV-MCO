import MainLayout from "@/template/MainLayout"
import NotifModal from "@/components/ui/NotifModal"

function HomePage() {
    return (
        <MainLayout>
            <h1 className='text-green-300'>HOMEPAGE</h1>
            <NotifModal></NotifModal>
        </MainLayout>    
    )
}

export default HomePage