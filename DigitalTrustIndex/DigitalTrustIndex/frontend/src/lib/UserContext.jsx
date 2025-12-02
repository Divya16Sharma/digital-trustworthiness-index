import { createContext, useContext, useState, useEffect } from 'react'

const UserContext = createContext(null)

const DEMO_USER = {
  id: 'demo-user',
  firstName: 'Demo',
  lastName: 'User',
  emailAddresses: [{ emailAddress: 'demo@example.com' }]
}

export function UserProvider({ children, clerkUser }) {
  const [user, setUser] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (clerkUser !== undefined) {
      setUser(clerkUser || DEMO_USER)
      setIsLoaded(true)
    }
  }, [clerkUser])

  const signOut = async () => {
    setUser(DEMO_USER)
    window.location.href = '/'
  }

  return (
    <UserContext.Provider value={{ user, isLoaded, signOut, isDemoMode: !clerkUser }}>
      {children}
    </UserContext.Provider>
  )
}

export function useAppUser() {
  const context = useContext(UserContext)
  if (!context) {
    return {
      user: DEMO_USER,
      isLoaded: true,
      signOut: () => { window.location.href = '/' },
      isDemoMode: true
    }
  }
  return context
}

export { DEMO_USER }
