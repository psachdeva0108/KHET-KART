import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CartContext = createContext(null)
const STORAGE_KEY = 'farmlink.cart.items'

function readStoredItems() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

// product-spec §51: cart must support multiple farmers. Each product id in
// this app already belongs to exactly one farmer's listing (see
// data/products.js), so keying cart lines by productId keeps each farmer's
// line item distinct without extra composite-key bookkeeping.
export function CartProvider({ children }) {
  const [items, setItems] = useState(readStoredItems)
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  function addItem(product, quantity = 1) {
    const safeQuantity = Math.max(1, Number(quantity) || 1)
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + safeQuantity }
            : item
        )
      }
      return [...prev, { product, quantity: safeQuantity }]
    })
    setNotification({ productName: product?.name ?? 'Product', quantity: safeQuantity })
  }

  function clearNotification() {
    setNotification(null)
  }

  function removeItem(productId) {
    setItems((prev) => prev.filter((item) => item.product.id !== productId))
  }

  function updateQuantity(productId, quantity) {
    if (quantity <= 0) {
      removeItem(productId)
      return
    }
    setItems((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    )
  }

  function clearCart() {
    setItems([])
  }

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const produceTotal = items.reduce((sum, item) => sum + item.quantity * item.product.price, 0)

  // Groups cart lines by farmer for the multi-farmer cart display (§51).
  const groupedByFarmer = useMemo(() => {
    const groups = new Map()
    items.forEach((item) => {
      const farmerId = item.product.farmer?.id ?? 'unknown'
      if (!groups.has(farmerId)) {
        groups.set(farmerId, { farmer: item.product.farmer, items: [], subtotal: 0 })
      }
      const group = groups.get(farmerId)
      group.items.push(item)
      group.subtotal += item.quantity * item.product.price
    })
    return Array.from(groups.values())
  }, [items])

  const value = useMemo(
    () => ({
      items,
      itemCount,
      produceTotal,
      groupedByFarmer,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      notification,
      clearNotification,
    }),
    [items, itemCount, produceTotal, groupedByFarmer, notification]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within a CartProvider')
  return context
}
