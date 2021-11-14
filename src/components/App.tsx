import React from 'react'
import { Flex } from '@chakra-ui/react'
import { Routes, Route, Navigate } from 'react-router-dom'

import { useSupabaseSession } from '../supabase'
import { Auth } from './Auth'
import { Home } from './Home'

export const App: React.FC = () => {
  const session = useSupabaseSession()

  if (session === undefined) {
    // don't render anything while we don't know whether we have a session
    return null
  }

  if (session === null) {
    return <Auth />
  }

  return (
    <Flex justifyContent="center">
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Flex>
  )
}
