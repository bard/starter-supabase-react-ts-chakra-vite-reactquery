import React, { useContext, useState, useEffect } from 'react'
import { SupabaseClient, Session } from '@supabase/supabase-js'

const SupabaseContext = React.createContext<SupabaseClient | null>(null)

export const SupabaseProvider: React.FC<{
  client: SupabaseClient
}> = ({ children, client }) => {
  return (
    <SupabaseContext.Provider value={client}>
      {children}
    </SupabaseContext.Provider>
  )
}

export const useSupabase = () => {
  const client = useContext(SupabaseContext)
  if (!client) throw new Error('Supabase client not initialized')
  return client
}

export const useSupabaseSession = (): Session | null | undefined => {
  const supabase = useSupabase()

  const [session, setSession] = useState<undefined | null | Session>(
    undefined,
  )

  useEffect(() => {
    const session = supabase.auth.session()

    if (document.location.hash.includes('access_token')) {
      // supabase client hasn't initialized a session yet, but will do so
      // soon. do nothing here (to prevent e.g. an auth screen flashing) and
      // leave it to onAuthStateChange
    } else {
      setSession(session)
    }

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
      },
    )

    return () => {
      if (authListener) {
        authListener.unsubscribe()
      }
    }
  }, [])

  return session
}
