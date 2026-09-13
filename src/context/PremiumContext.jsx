import { createContext, useContext, useMemo, useState } from 'react'
import { useAuth } from './AuthContext'

const PremiumContext = createContext(null)

// Shared Premium UI state. Premium status is sourced from AuthContext so
// the upgrade modal always reflects the user's actual subscription state.
export function PremiumProvider({ children }) {
  const { user } = useAuth()
  const [modalOpen, setModalOpen] = useState(false)

  const isPremium = Boolean(user?.isPremium)

  const value = useMemo(
    () => ({
      isPremium,
      modalOpen,
      openModal: () => setModalOpen(true),
      closeModal: () => setModalOpen(false),
    }),
    [isPremium, modalOpen]
  )

  return <PremiumContext.Provider value={value}>{children}</PremiumContext.Provider>
}

export function usePremiumMock() {
  const context = useContext(PremiumContext)
  if (!context) throw new Error('usePremiumMock must be used within a PremiumProvider')
  return context
}
