import React, { useState, useEffect } from 'react'
import { supabase } from './config'

interface IUser {
    user: {} | null,
    isLoading: boolean,
}

const UserContext = React.createContext<IUser | null>(null)

const UserContextProvider: React.FC<any> = ({children}) => {
    const [user, setUser] = useState<IUser>(
        {user: null, isLoading: true}
    )
    useEffect(()=>{
        fetchUser()
    },[])

    const fetchUser = async ()  => {
        const {data} = await supabase.auth.getSession()
        setUser({user: data?.session?.user ?? null, isLoading: false})
    }

    return(
        <UserContext.Provider value={{user}}>
            {children}
        </UserContext.Provider>
    )
}

export {UserContext}

export default UserContextProvider