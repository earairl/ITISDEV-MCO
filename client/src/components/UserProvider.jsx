/*
import using:
    import { UserContext } from '@/components/UserProvider'

to declare user:
    const { user, setUser } = useContext(UserContext)

make sure user is in proper format (must retrieve user info from getUser in backend [user.js])
*/

import { createContext, useState, useEffect } from 'react'

export const UserContext = createContext()

export function UserProvider({ children }) {
    const [user, setUser] = useState(() => {
        const stored = sessionStorage.getItem('user')
        return stored ? JSON.parse(stored) : { username: 'guest', position: 'guest' }
    })

    useEffect(() => {
        if (user) {
            sessionStorage.setItem('user', JSON.stringify(user))
        } else {
            sessionStorage.removeItem('user')
        }
    }, [user])

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    )
}
