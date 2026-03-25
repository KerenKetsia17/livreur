import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { auth } from '../firebase'
import { onAuthStateChanged } from 'firebase/auth'

const FirebaseContext = createContext(null)

export function FirebaseProvider({ children }) {
  const [user, setUser] = useState(null)
  const [initializing, setInitializing] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setInitializing(false)
    })
    return () => unsubscribe()
  }, [])

  const value = useMemo(() => ({ user, initializing }), [user, initializing])

  return <FirebaseContext.Provider value={value}>{children}</FirebaseContext.Provider>
}

export function useFirebase() {
  const value = useContext(FirebaseContext)
  if (!value) throw new Error('useFirebase must be used within FirebaseProvider')
  return value
}
