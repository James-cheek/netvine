import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from './supabase'
import { useAuth } from './AuthContext'

const ProfileContext = createContext(null)

export function ProfileProvider({ children }) {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)

  const refresh = useCallback(async () => {
    if (!user) return
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    if (data) setProfile(data)
  }, [user])

  useEffect(() => { refresh() }, [refresh])

  const isPro = profile?.plan === 'pro'

  return (
    <ProfileContext.Provider value={{ profile, isPro, refreshProfile: refresh }}>
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfile() {
  const ctx = useContext(ProfileContext)
  if (ctx === null) throw new Error('useProfile must be used within ProfileProvider')
  return ctx
}
