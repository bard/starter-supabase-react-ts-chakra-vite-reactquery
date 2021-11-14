import React, { useState } from 'react'
import {
  VStack,
  Icon,
  IconButton,
  Checkbox,
  HStack,
  ListItem,
  List,
  Text,
  Button,
  Input,
} from '@chakra-ui/react'
import { DeleteIcon, CheckIcon, CloseIcon } from '@chakra-ui/icons'

import { Item } from '../types'
import {
  useItemsQuery,
  useDeleteItemMutation,
  useUpdateItemMutation,
  useAddItemMutation,
} from './Checklist.queries'

export const Checklist: React.FC<{}> = () => {
  const [isEnteringNewItem, setIsEnteringNewItem] = useState(false)
  const items = useItemsQuery()
  const deleteItem = useDeleteItemMutation()
  const updateItem = useUpdateItemMutation()
  const addItem = useAddItemMutation()

  const handleUpdateItem = (updatedItem: Item) => {
    updateItem.mutate(updatedItem)
  }

  const handleTrashItem = async (itemId: string) => {
    deleteItem.mutate({ itemId })
  }

  const handleAcceptNewItem = async (title: string) => {
    addItem.mutate({ title })
    setIsEnteringNewItem(false)
  }

  const handleBeginEnteringNewItem = () => {
    setIsEnteringNewItem(true)
  }

  const handleCancelNewItem = () => {
    setIsEnteringNewItem(false)
  }

  if (items.isLoading) {
    return <Text>Loading...</Text>
  } else if (items.error) {
    return <Text>Error: {items.error.message}</Text>
  } else if (items.isSuccess) {
    return (
      <VStack align="stretch">
        {items.data.length === 0 ? (
          <Text py={10} textAlign="center">
            No items available. Click "Add item" to add one.
          </Text>
        ) : (
          <List spacing={3} w="100%">
            {items.data.map((item, i) => (
              <ListItem key={item.id}>
                <ChecklistItem
                  onUpdate={handleUpdateItem}
                  onDelete={() => handleTrashItem(item.id)}
                  item={item}
                />
              </ListItem>
            ))}
          </List>
        )}

        {isEnteringNewItem && (
          <NewItemInput
            onAccept={handleAcceptNewItem}
            onCancel={handleCancelNewItem}
          />
        )}

        <Button isFullWidth onClick={handleBeginEnteringNewItem}>
          Add item
        </Button>
      </VStack>
    )
  } else {
    return null
  }
}

const ChecklistItem: React.FC<{
  item: Item
  onDelete: () => void
  onUpdate: (updatedItem: Item) => void
}> = ({ item, onDelete, onUpdate }) => {
  const handleToggleItem = async () => {
    onUpdate({ ...item, is_complete: !item.is_complete })
  }

  return (
    <HStack>
      <Checkbox
        size="lg"
        onChange={handleToggleItem}
        isChecked={item.is_complete}
        data-testid={'check-' + item.id}
      />

      <Text
        flex={1}
        as="span"
        textDecoration={item.is_complete ? 'line-through' : undefined}
      >
        {item.title}
      </Text>

      <IconButton
        aria-label="Delete"
        onClick={onDelete}
        data-testid={'delete-' + item.id}
        icon={<Icon as={DeleteIcon} />}
      />
    </HStack>
  )
}

const NewItemInput: React.FC<{
  onAccept: (title: string) => void
  onCancel: () => void
}> = ({ onAccept, onCancel }) => {
  const [newItemTitle, setNewItemTitle] = useState<string>('')

  const handleAccept = () => {
    // TODO validate
    onAccept(newItemTitle.trim())
  }

  return (
    <HStack>
      <Input
        value={newItemTitle}
        onChange={(e) => setNewItemTitle(e.currentTarget.value)}
        flex={1}
        autoFocus
        placeholder="Enter new item"
      />
      <IconButton
        aria-label="Accept"
        icon={<Icon as={CheckIcon} />}
        colorScheme="blue"
        onClick={handleAccept}
      />
      <IconButton
        aria-label="Cancel"
        icon={<Icon as={CloseIcon} />}
        onClick={onCancel}
      />
    </HStack>
  )
}
