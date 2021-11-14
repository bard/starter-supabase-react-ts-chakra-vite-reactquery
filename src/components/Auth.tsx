import React, { useState } from 'react'
import {
  Container,
  Center,
  Heading,
  Box,
  Link,
  VStack,
  Text,
  FormControl,
  Input,
  Button,
} from '@chakra-ui/react'
import { Provider } from '@supabase/gotrue-js'

import { useSupabase } from '../supabase'

export const Auth: React.FC = () => {
  return (
    <Container maxW="xs">
      <VStack align="stretch">
        <Branding />

        <MagicLinkLogin />

        <Text textAlign="center" color="gray">
          — or —
        </Text>

        <OAuthLogin type="google" label="Google" />
        <OAuthLogin type="github" label="GitHub" />
      </VStack>
    </Container>
  )
}

const Branding: React.FC = () => {
  return (
    <Center w="100%" py={10}>
      <Heading size="xl">MyApp</Heading>
    </Center>
  )
}

const OAuthLogin: React.FC<{ type: Provider; label: string }> = ({
  type,
  label,
}) => {
  const supabase = useSupabase()

  const handleOAuthLogin = async (provider: Provider) => {
    const { error } = await supabase.auth.signIn(
      { provider },
      { redirectTo: import.meta.env.VITE_FRONTEND_URL },
    )
    if (error) console.log('Error: ', error.message)
  }

  return (
    <Button onClick={() => handleOAuthLogin(type)} type="button">
      Sign in with {label}
    </Button>
  )
}

const MagicLinkLogin: React.FC = () => {
  const supabase = useSupabase()
  const [status, setStatus] = useState<
    'input' | 'processing' | 'success' | 'error'
  >('input')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit: React.FormEventHandler = async (e) => {
    e.preventDefault()
    if (status !== 'input') return

    setStatus('processing')
    const { user, error } = await supabase.auth.signIn(
      { email },
      { redirectTo: import.meta.env.VITE_FRONTEND_URL },
    )

    if (user) {
      throw new Error('Already authenticated')
    } else if (error) {
      setStatus('error')
      setMessage(error.message)
    } else {
      setStatus('success')
      setMessage('Email sent, please check your inbox.')
    }
  }

  const handleEmailChange: React.ChangeEventHandler<HTMLInputElement> = (
    e,
  ) => {
    setEmail(e.target.value)
  }

  const handleRetry = () => {
    setStatus('input')
  }

  return (
    <form onSubmit={handleSubmit}>
      <VStack align="stretch">
        <FormControl isRequired isInvalid={status === 'error'}>
          <Input
            disabled={status !== 'input'}
            autoFocus
            placeholder="Enter your email"
            type="email"
            name="email"
            required
            value={email}
            onChange={handleEmailChange}
          />
        </FormControl>

        {status === 'input' || status === 'processing' ? (
          <Button
            colorScheme="blue"
            type="submit"
            isLoading={status === 'processing'}
          >
            Send me a login link
          </Button>
        ) : status === 'error' ? (
          <Box px={3}>
            <Text color="red">
              {message}{' '}
              <Link onClick={handleRetry} textDecor="underline" color="blue">
                Retry
              </Link>
            </Text>
          </Box>
        ) : (
          <Box px={3}>
            <Text textAlign="center">{message}</Text>
          </Box>
        )}
      </VStack>
    </form>
  )
}
