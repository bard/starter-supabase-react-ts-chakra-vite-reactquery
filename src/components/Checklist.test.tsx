import React from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import {
  render,
  fireEvent,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

import { Checklist } from './Checklist'
import { SupabaseProvider } from '../supabase'

describe('CheckList', () => {
  const fetch = jest
    .fn()
    .mockImplementation((_url: string, { method }: { method: string }) => {
      if (method === 'GET') {
        return Promise.resolve({
          ok: true,
          text: () =>
            JSON.stringify([
              { id: 'foo', title: 'Foo', is_completed: false },
            ]),
          headers: { get: () => undefined },
        })
      } else if (method === 'DELETE') {
        return Promise.resolve({ ok: true })
      } else if (method === 'POST') {
        return Promise.resolve({
          ok: true,
          text: () =>
            JSON.stringify({
              id: 'bar',
              title: 'bar',
              is_completed: false,
            }),
          headers: { get: () => undefined },
        })
      } else {
        throw new Error('Unhandled')
      }
    })

  const supabase = createSupabaseClient(
    'https://example.supabase.co',
    'secret',
    { fetch: fetch },
  )

  const queryClient = new QueryClient()

  beforeEach(() => {
    queryClient.clear()
    jest.clearAllMocks()
  })

  const renderWithContext = (children: React.ReactElement) => {
    render(
      <SupabaseProvider client={supabase}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </SupabaseProvider>,
    )
  }

  test.todo('displays message when no item is available')

  test('renders item', async () => {
    renderWithContext(<Checklist />)

    expect(screen.getByText('Loading...')).toBeInTheDocument()

    await waitFor(() => expect(screen.getByText('Foo')).toBeInTheDocument())

    expect(fetch).toHaveBeenLastCalledWith(
      'https://example.supabase.co/rest/v1/items?select=*&order=created_at.desc.nullslast',
      expect.objectContaining({
        headers: expect.objectContaining({ apikey: 'secret' }),
      }),
    )
  })

  test('allows removing item', async () => {
    renderWithContext(<Checklist />)

    await waitFor(() => expect(screen.getByText('Foo')).toBeInTheDocument())

    fireEvent.click(screen.getByTestId('delete-foo'))

    await waitForElementToBeRemoved(() => screen.queryByText('Foo'))

    expect(fetch.mock.calls.slice(-2)).toEqual([
      [
        'https://example.supabase.co/rest/v1/items?id=eq.foo',
        expect.objectContaining({ method: 'DELETE' }),
      ],

      [
        'https://example.supabase.co/rest/v1/items?select=*&order=created_at.desc.nullslast',
        expect.objectContaining({ method: 'GET' }),
      ],
    ])
  })

  test('allows adding item', async () => {
    renderWithContext(<Checklist />)

    await waitFor(() => {
      expect(screen.getByText('Add item')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Add item'))

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText('Enter new item'),
      ).toBeInTheDocument()
    })

    userEvent.type(screen.getByPlaceholderText('Enter new item'), 'Bar')

    fireEvent.click(screen.getByLabelText('Accept'))

    await waitFor(() => {
      expect(screen.getByText('Bar')).toBeInTheDocument()
    })

    expect(fetch.mock.calls.slice(-2)).toEqual([
      [
        'https://example.supabase.co/rest/v1/items',
        expect.objectContaining({
          method: 'POST',
          body: '{"title":"Bar"}',
        }),
      ],

      [
        'https://example.supabase.co/rest/v1/items?select=*&order=created_at.desc.nullslast',
        expect.objectContaining({ method: 'GET' }),
      ],
    ])
  })
})
