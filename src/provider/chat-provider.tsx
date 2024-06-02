'use client'
import { HistoryChatEnum, MessageTypeEnum } from '@/contants/enum'
import { voiceChatService } from '@/services/voice-chat'
import { DataResponseType, IMessage } from '@/types/messages'
import { PromptType } from '@/types/prompt'
import { formatDataResponse, speakAudio } from '@/utils'
import { Dispatch, SetStateAction, createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useWrapper } from './wrapper-provider'

type ChatContextType = {
  messages: IMessage[]
  setMessages: Dispatch<SetStateAction<IMessage[]>>
  prompts: PromptType
  showFirstDiv: boolean
  setShowFirstDiv: Dispatch<SetStateAction<boolean>>
  isGenerate: boolean
  setPrompts: Dispatch<SetStateAction<PromptType>>
  isEnableMic: boolean
  setIsEnableMic: Dispatch<SetStateAction<boolean>>
  isCompleted: boolean
  setIsCompleted: Dispatch<SetStateAction<boolean>>
  isResponding: boolean
  setIsResponding: Dispatch<SetStateAction<boolean>>
  isError: boolean
  setIsError: Dispatch<SetStateAction<boolean>>
  error: string
  setError: Dispatch<SetStateAction<string>>
  isStart: boolean
  setIsStart: Dispatch<SetStateAction<boolean>>
  heightChatContent: number
  setHeightChatContent: Dispatch<SetStateAction<number>>
  pushMessage: (data: DataResponseType) => void
  addUserMessage: (message: IMessage) => void
  initChat: () => void
  communicate: () => void
  switchLevel: () => void
  saveHistoryChat: () => void
  deleteHistoryChat: () => void
  getHistoryChat: () => void
  updateChatContentScroll: () => void
}

export const ChatContext = createContext<ChatContextType | null>(null)

const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, level, setLevel } = useWrapper()
  const [showFirstDiv, setShowFirstDiv] = useState(true)
  const [messages, setMessages] = useState<IMessage[]>([])
  const [prompts, setPrompts] = useState<PromptType>({
    options: [],
    text: [],
  })
  const [isGenerate, setIsGenerate] = useState(false)
  const [isGenerated, setIsGenerated] = useState(false)
  const [isEnableMic, setIsEnableMic] = useState(false)
  const [isStart, setIsStart] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [isResponding, setIsResponding] = useState(false)
  const [isError, setIsError] = useState(false)
  const [error, setError] = useState('')
  const [heightChatContent, setHeightChatContent] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const saveHistoryChat = useCallback(() => {
    if (messages.length > 0 && messages[messages.length - 1]?.type !== MessageTypeEnum.COMPLETED) {
      localStorage.setItem(HistoryChatEnum.MESSAGES, JSON.stringify(messages))
      localStorage.setItem(HistoryChatEnum.PROMPTS, JSON.stringify(prompts))
      localStorage.setItem(HistoryChatEnum.LEVEL, JSON.stringify(level))
    }
  }, [messages, level, prompts])

  const deleteHistoryChat = useCallback(() => {
    localStorage.removeItem(HistoryChatEnum.MESSAGES)
    localStorage.removeItem(HistoryChatEnum.PROMPTS)
    localStorage.removeItem(HistoryChatEnum.LEVEL)
  }, [])

  const getHistoryChat = useCallback(() => {
    if (typeof localStorage === 'undefined') {
      return
    }
    const data = JSON.parse(localStorage.getItem(HistoryChatEnum.MESSAGES)!)
    const prompts = JSON.parse(localStorage.getItem(HistoryChatEnum.PROMPTS)!)
    const level = JSON.parse(localStorage.getItem(HistoryChatEnum.LEVEL)!)

    if (data && data.length > 0) {
      setMessages(data)
      setPrompts(prompts)

      setIsStart(true)
      setLevel(Number(level))
    }
  }, [setLevel])

  const pushMessage = useCallback((data: DataResponseType) => {
    setMessages((preMessages) => {
      const updatedMessages = [...preMessages]
      updatedMessages[updatedMessages.length - 1] = formatDataResponse(data)
      return updatedMessages
    })
    setIsResponding(false)
  }, [])

  const addUserMessage = useCallback((message: IMessage) => {
    setMessages((prevMessages) => [...prevMessages, message] as IMessage[])
  }, [])

  const initChat = useCallback(async () => {
    const data = await voiceChatService.initChat()

    if (data && data.chatId) {
      setShowFirstDiv(false)
      const mesTime = setTimeout(() => {
        setMessages([formatDataResponse(data)])
        const audio = speakAudio(data.voice?.data, setIsEnableMic)

        audioRef.current = audio
      }, 500)
      return () => clearTimeout(mesTime)
    }
  }, [])

  const communicate = useCallback(async () => {
    const index = messages.length - 2

    if (messages[index + 1]?.type === MessageTypeEnum.IMAGE && messages[index + 1]?.subMessage) {
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            chatId: messages[index + 1].chatId,
            name: 'Artify',
            avatar: '/images/chat/artify-avatar.svg',
            message: messages[index + 1].subMessage!,
            type: MessageTypeEnum.CHOOSE_IMG,
            options: Array.from({ length: messages[index + 1].images?.length || -1 }, (_, index) =>
              (index + 1).toString()
            ) || ['1', '2', '3', '4'],
            activeOption: -1,
            index: messages[index + 1].index,
            image: messages[index + 1].image,
          },
        ])

        audioRef.current = speakAudio(messages[index + 1].voice!, setIsEnableMic)
        messages[index + 1].voice = []
      }, 5000)
    } else if (messages[index]?.type === MessageTypeEnum.USER && messages[index + 1].type === MessageTypeEnum.TYPING) {
      setIsEnableMic(false)
      const userMessage = messages[index].message.toLowerCase()
      let data: DataResponseType
      if (messages[index - 1]?.type === MessageTypeEnum.CONFIRM && userMessage.includes('yes')) {
        setTimeout(() => {
          setIsGenerate(true)
        }, 1000)
      }

      data =
        messages[index - 1]?.type !== MessageTypeEnum.CHOOSE_IMG &&
        (await voiceChatService.communicate({
          chatId: messages[index - 1].chatId,
          message: userMessage,
          level,
        }))

      switch (messages[index - 1]?.type) {
        case MessageTypeEnum.CHOOSE_IMG:
          if (!isAuthenticated && localStorage.getItem(HistoryChatEnum.MESSAGES) === null) {
            setTimeout(() => {
              const buttonConnect = document.getElementById('button-connect')
              if (buttonConnect) {
                buttonConnect.click()
              }
            }, 2500)
            return
          }

          data = await voiceChatService.communicate({
            chatId: messages[index - 1].chatId,
            message: userMessage,
            level,
          })

          messages[index - 1].activeOption = Number(data.metadata?.index) - 1

          pushMessage(data)
          setIsCompleted(true)
          setIsEnableMic(false)
          deleteHistoryChat()

          break
        case MessageTypeEnum.TEXT:
          const promptText: string[] = data.metadata?.prompt || []

          setPrompts((prevPrompts) => ({
            ...prevPrompts,
            text: [...prevPrompts.text, ...promptText],
          }))
          setTimeout(() => {
            pushMessage(data)
            audioRef.current = speakAudio(data.voice?.data, setIsEnableMic)
          }, 1000)
          break
        case MessageTypeEnum.CONFIRM:
          if (data.metadata?.images) {
            setIsGenerate(false)
            setIsGenerated(true)
            pushMessage(data)
          }
          audioRef.current = speakAudio(data.voice?.data)
          break
        default:
          const arrayPrompt = data.metadata.prompt ? [...data.metadata.prompt] : []

          if (arrayPrompt !== null && arrayPrompt[0] !== null) {
            setPrompts((prevPrompts) => ({
              ...prevPrompts,
              options: [...prevPrompts.options, ...arrayPrompt],
            }))
          }

          messages[index - 1].activeOption = messages[index - 1].options.indexOf(arrayPrompt[0])
          setTimeout(() => {
            pushMessage(data)
            audioRef.current = speakAudio(data.voice?.data, setIsEnableMic)
          }, 1000)

          break
      }
    }
  }, [messages, isAuthenticated, level, pushMessage, deleteHistoryChat])

  const switchLevel = useCallback(() => {
    if (localStorage.getItem(HistoryChatEnum.LEVEL) !== null) {
      return
    }
    setMessages([])
    setPrompts({
      options: [],
      text: [],
    })
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    setIsResponding(false)
    setIsEnableMic(false)
    setShowFirstDiv(true)
    setError('')
    setIsError(false)
  }, [])

  const updateChatContentScroll = useCallback(() => {
    const mobileBottom = document.querySelector('#mobile-bottom')?.clientHeight
    const heightPromptDesktop = document.querySelector('#desktop-prompt')?.clientHeight

    if (heightPromptDesktop) {
      setHeightChatContent(50 + heightPromptDesktop)
      return
    }

    setHeightChatContent(mobileBottom!)
  }, [setHeightChatContent])

  useEffect(() => {
    updateChatContentScroll()
  }, [updateChatContentScroll])

  useEffect(() => {
    getHistoryChat()
  }, [getHistoryChat])

  return (
    <ChatContext.Provider
      value={{
        messages,
        prompts,
        showFirstDiv,
        isEnableMic,
        isCompleted,
        isResponding,
        isGenerate,
        isError,
        error,
        isStart,
        heightChatContent,
        setHeightChatContent,
        setMessages,
        setIsEnableMic,
        setIsCompleted,
        setIsResponding,
        setPrompts,
        setIsError,
        setError,
        setIsStart,
        setShowFirstDiv,
        pushMessage,
        addUserMessage,
        initChat,
        communicate,
        switchLevel,
        getHistoryChat,
        deleteHistoryChat,
        saveHistoryChat,
        updateChatContentScroll,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export default ChatProvider

export const useChat = () => {
  const context = useContext(ChatContext as React.Context<ChatContextType>)

  if (!context) {
    throw new Error('useChat must be called within ChatProvider')
  }

  return context
}
