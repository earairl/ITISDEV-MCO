function MainLayout({ children }) {
    return (
        <div className="bg-blue-500">
            <header className='w-auto h-20 bg-green-400 flex flex-col'>
                <nav>
                    <ul>
                        <li>Home</li>
                        <li>Profile</li>
                        <li>Games</li>
                    </ul>
                </nav>
            </header>
            <div>
                {children}
            </div>
        </div>
    )
}

export default MainLayout