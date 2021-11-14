import React from 'react'
import ReactDOM from 'react-dom'
import { ChakraProvider } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { BrowserRouter } from 'react-router-dom'

import './index.css'
import { App } from './components/App'
import { SupabaseProvider } from './supabase'

const queryClient = new QueryClient()

const supabaseClient = createSupabaseClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY,
)

ReactDOM.render(
  <React.StrictMode>
    <SupabaseProvider client={supabaseClient}>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <ChakraProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ChakraProvider>
      </QueryClientProvider>
    </SupabaseProvider>
  </React.StrictMode>,
  document.getElementById('root'),
)
