'use client'
import { HistoryChatEnum } from '@/contants/enum'
import { Dispatch, SetStateAction, createContext, useContext, useEffect, useState } from 'react'

type HomeContextType = {
  isAuthenticated: boolean
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>
  isShowBlank: boolean
  setIsShowBlank: Dispatch<SetStateAction<boolean>>
  level: number
  setLevel: Dispatch<SetStateAction<number>>
  isMinted: boolean
  setIsMinted: Dispatch<SetStateAction<boolean>>
}

const HomeContext = createContext<HomeContextType | null>(null)

const WrapperProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isShowBlank, setIsShowBlank] = useState(false)
  const [level, setLevel] = useState(0)
  const [isMinted, setIsMinted] = useState(false)

  useEffect(() => {
    const levelStorage = JSON.parse(localStorage.getItem(HistoryChatEnum.LEVEL)!)
    setIsAuthenticated(isAuthenticated)
    setIsMinted(isMinted)
    levelStorage ? setLevel(Number(levelStorage)) : setLevel(level)
  }, [isAuthenticated, level, isMinted])

  return (
    <HomeContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        isShowBlank,
        setIsShowBlank,
        level,
        setLevel,
        isMinted,
        setIsMinted,
      }}
    >
      {children}
    </HomeContext.Provider>
  )
}

export default WrapperProvider

export const useWrapper = () => {
  const context = useContext(HomeContext as React.Context<HomeContextType>)

  if (!context) {
    throw new Error('useWrapper must be called within WrapProvider')
  }

  return context
}
