import { useQuery, useMutation, useQueryClient } from 'react-query'

import { Item } from '../types'
import { useSupabase } from '../supabase'

export const useItemsQuery = () => {
  const supabase = useSupabase()

  return useQuery<Item[], Error>('items', async () => {
    const { data, error } = await supabase
      .from<Item>('items')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    if (data === null) throw new Error('Bug')
    return data
  })
}

export const useDeleteItemMutation = () => {
  const supabase = useSupabase()
  const queryClient = useQueryClient()

  return useMutation(
    async ({ itemId }: { itemId: string }) => {
      await supabase.from('items').delete().eq('id', itemId)
    },
    {
      onMutate: async ({ itemId }: { itemId: string }) => {
        queryClient.setQueryData<Item[]>('items', (items) =>
          items ? items.filter((item) => item.id !== itemId) : [],
        )
      },
      onSuccess: () => queryClient.invalidateQueries('items'),
    },
  )
}

export const useUpdateItemMutation = () => {
  const supabase = useSupabase()
  const queryClient = useQueryClient()

  return useMutation(
    async (updatedItem: Item) => {
      const { data: item, error } = await supabase
        .from<Item>('items')
        .update({ is_complete: updatedItem.is_complete })
        .eq('id', updatedItem.id)
        .single()

      if (error) throw error
      if (item === null) throw new Error('Bug')
      return item
    },
    {
      onMutate: async (updatedItem: Item) => {
        queryClient.cancelQueries('items')
        const preMutationSnapshot = queryClient.getQueryData('items')
        queryClient.setQueryData<Item[]>('items', (items) =>
          items
            ? items.map((item) =>
                item.id === updatedItem.id ? updatedItem : item,
              )
            : [],
        )
        return { preMutationSnapshot }
      },
      onSuccess: () => {
        queryClient.invalidateQueries('items')
      },
      onError: ({ preMutationSnapshot }: { preMutationSnapshot: Item[] }) => {
        queryClient.setQueriesData('items', preMutationSnapshot)
      },
    },
  )
}

export const useAddItemMutation = () => {
  const supabase = useSupabase()
  const queryClient = useQueryClient()

  return useMutation(
    async ({ title }: { title: string }) => {
      const { error } = await supabase
        .from<Item>('items')
        .insert({ title })
        .single()
      if (error) throw error
    },
    {
      onMutate: async ({ title }) => {
        queryClient.cancelQueries('items')
        const preMutationSnapshot = queryClient.getQueryData('items')
        queryClient.setQueryData<Item[]>('items', (items) =>
          items
            ? [
                {
                  id: Math.random().toString(),
                  title,
                  url: 'https://www.example.com',
                  is_complete: false,
                  created_at: new Date().toISOString(),
                },
                ...items,
              ]
            : [],
        )
        return { preMutationSnapshot }
      },
      onSuccess: () => {
        queryClient.invalidateQueries('items')
      },
      onError: ({ preMutationSnapshot }: { preMutationSnapshot: Item[] }) => {
        queryClient.setQueriesData('items', preMutationSnapshot)
      },
    },
  )
}
