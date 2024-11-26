import { createContext, useEffect, useState } from 'react'

export const DataProvider = createContext()

function ContextProvider({ children }) {
  const [contextdata, setContextdata] = useState({
    wishList: [],
  })


  return (
    <DataProvider.Provider value={{ setContextdata, contextdata }}>
      {children}
    </DataProvider.Provider>
  )
}

export default ContextProvider
