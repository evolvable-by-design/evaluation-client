import React from 'react'

const LibraryContext = React.createContext()

function LibraryContextProvider({children, components, genericComponent}) {
  return (
    <LibraryContext.Provider value={{components, genericComponent}}>
      {children}
    </LibraryContext.Provider>
  )
}

function useLibraryContextState() {
  const context = React.useContext(LibraryContext)
  if (context === undefined) {
    throw new Error('useLibraryContextState must be used within a LibraryContextProvider')
  }
  return context
}

export { LibraryContextProvider, useLibraryContextState }
