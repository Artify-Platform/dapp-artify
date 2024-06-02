import { IMessage } from '@/types/messages'
import { useEffect, useMemo, useRef } from 'react'

const useScrollToBottom = (list: IMessage[]) => {
  const chatEndRef = useRef<HTMLDivElement>(null)
  const scrollToBottom = () => {
    chatEndRef.current?.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }
  useEffect(() => {
    scrollToBottom()
  }, [list])
  return useMemo(() => {
    return {
      current: chatEndRef,
    }
  }, [])
}

export default useScrollToBottom
