import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const WishlistContext = createContext(null)
const STORAGE_KEY = 'farmlink.wishlist'

function readStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : { products: [], farmers: [], fpos: [] }
  } catch {
    return { products: [], farmers: [], fpos: [] }
  }
}

// product-spec §55: save products, farmers and FPOs. Saved farmers stay
// publicly accessible profiles — this is not a private connection (§44/§54).
export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(readStored)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist))
  }, [wishlist])

  function toggle(kind, id) {
    setWishlist((prev) => {
      const list = prev[kind]
      const next = list.includes(id) ? list.filter((x) => x !== id) : [...list, id]
      return { ...prev, [kind]: next }
    })
  }

  function isSaved(kind, id) {
    return wishlist[kind].includes(id)
  }

  const value = useMemo(() => ({ wishlist, toggle, isSaved }), [wishlist])

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) throw new Error('useWishlist must be used within a WishlistProvider')
  return context
}
