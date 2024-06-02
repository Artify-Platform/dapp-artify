import { useChat } from '@/provider/chat-provider'
import { useCallback, useRef } from 'react'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import 'regenerator-runtime'

const useVoiceChat = () => {
  const { finalTranscript, listening, browserSupportsSpeechRecognition, resetTranscript } = useSpeechRecognition()
  const { messages, setIsEnableMic, addUserMessage, setIsResponding, setIsStart } = useChat()
  const timerStartSpeaking = useRef<NodeJS.Timeout | null>(null)

  const stopSpeaking = useCallback(() => {
    SpeechRecognition.stopListening()
  }, [])

  const startSpeaking = useCallback(() => {
    clearTimeout(timerStartSpeaking.current!)
    resetTranscript()
    SpeechRecognition.startListening({ continuous: true, language: 'en-US' })

    timerStartSpeaking.current = setTimeout(() => {
      if (!finalTranscript) {
        stopSpeaking()
      }
    }, 10000)

    return () => {
      clearTimeout(timerStartSpeaking.current!)
    }
  }, [stopSpeaking, finalTranscript, resetTranscript])

  const handleListening = () => {
    if (listening) {
      stopSpeaking()
    } else startSpeaking()
  }

  const handleAddVoiceUserMessage = useCallback(
    (finalTranscript: string) => {
      if (messages.length > 0) {
        addUserMessage({
          chatId: '',
          avatar: '/images/chat/user-avatar.svg',
          name: 'dehaysmile',
          message:
            messages.length > 0 && messages[messages.length - 1]?.type === 'confirm'
              ? 'YES'
              : finalTranscript.charAt(0).toUpperCase() + finalTranscript.slice(1),
          type: 'user',
          options: [],
          activeOption: -1,
        })
        setIsEnableMic(false)

        const timer = setTimeout(() => {
          addUserMessage({
            chatId: '',
            avatar: '/images/chat/artify-avatar.svg',
            name: 'Artify',
            message: '',
            type: 'typing',
            options: [],
            activeOption: -1,
          })
          setIsResponding(true)

          return () => clearTimeout(timer)
        }, 2000)
      } else {
        setIsStart(true)
      }
      resetTranscript()
    },
    [messages, addUserMessage, setIsEnableMic, setIsStart, setIsResponding, resetTranscript]
  )

  return {
    startSpeaking,
    stopSpeaking,
    handleListening,
    handleAddVoiceUserMessage,
    listening,
    finalTranscript,
    resetTranscript,
    browserSupportsSpeechRecognition,
  }
}

export default useVoiceChat
