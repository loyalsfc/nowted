import React, { useState, useEffect } from 'react'
import { supabase } from './config'

 
const UserContext = React.createContext<string | null>(null)

const UserContextProvider: React.FC<any> = ({children}) => {
    const [userId, setUser] = useState<string  | null>(null)

    useEffect(()=>{
        fetchUser()
    },[])

    const fetchUser = async ()  => {
        const {data} = await supabase.auth.getSession()
        setUser(data?.session?.user.id ?? null)
    }

    return(
        <UserContext.Provider value={userId}>
            {children}
        </UserContext.Provider>
    )
}

export {UserContext}

export default UserContextProvider