'use client'
import 'regenerator-runtime'

import useVoiceChat from '@/hooks/useVoicechat'
import { useChat } from '@/provider/chat-provider'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useEffect } from 'react'
import { toast } from 'react-toastify'

const BtnVoice = () => {
  const { isEnableMic } = useChat()
  const {
    finalTranscript,
    listening,
    stopSpeaking,
    startSpeaking,
    handleListening,
    handleAddVoiceUserMessage,
    browserSupportsSpeechRecognition,
  } = useVoiceChat()

  if (!browserSupportsSpeechRecognition) toast.warning("Browser doesn't support speech recognition.")

  useEffect(() => {
    if (finalTranscript) {
      stopSpeaking()
      handleAddVoiceUserMessage(finalTranscript)
    }
  }, [finalTranscript, stopSpeaking, handleAddVoiceUserMessage])

  useEffect(() => {
    if (isEnableMic) {
      startSpeaking()
    } else {
      stopSpeaking()
    }
  }, [isEnableMic, stopSpeaking, startSpeaking])

  return (
    <>
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 120 },
          visible: { opacity: 1, y: 0, transition: { delayChildren: 1.5, staggerChildren: 1 } },
        }}
        initial='hidden'
        animate='visible'
        onClick={() => handleListening()}
        className={` bottom-[42px] z-[8] fixed md:left-[calc(50%_-_160px/2_+_570px)] md:bottom-[2%] flex h-[72px] w-[72px] md:h-[160px] md:w-[160px] cursor-pointer items-center justify-center overflow-hidden rounded-full ${listening ? 'drop-shadow-[0px_9px_29.1px_#7398FF]' : ''}`}
      >
        {listening ? (
          <>
            <Image
              src='/images/btn-voice/recording.gif'
              alt='recording.gif'
              className='absolute z-10 object-cover object-center w-[28.5px] h-[28.5px] md:w-[63.34px] md:h-[63.21px]'
              width={63.34}
              height={63.21}
            />

            <div className='overflow-hidden flex items-center justify-center rounded-full w-[115px] h-[115px] absolute z-[9] mix-blend-screen '>
              <Image
                src='/images/btn-voice/bg-recording.gif'
                alt='bg-recording.gif'
                className='object-cover bg-blend-screen w-[63px] h-[63px] md:w-[140px] md:h-[140px]'
                width={140}
                height={140}
              />
            </div>
          </>
        ) : (
          <Image
            src='/images/btn-voice/voice.svg'
            alt='voice'
            width={39.63}
            height={55.78}
            className='bottom-[32.83%] left-[calc(50%_-_39.63px/2_+_0px)] top-[32.3%] z-10 w-[17.83px] h-[25.1px] md:w-[39.63px] md:h-[55.78px]'
          />
        )}
        <div className='ellipse2 absolute left-0 top-0 h-full w-full rounded-full bg-[#3B3B3B] shadow-[0px_18.35px_14.68px_0px_#676767_inset]'></div>
        <div
          className={`ellipse1 absolute top-[7px] left-[7px] md:left-[16.88px] md:top-[16.88px] z-[8] w-[56.81px] h-[56.81px] md:h-[126.24px] md:w-[126.24px] rounded-full bg-[#3B3B3B] ${listening ? 'shadow-[0px_2.93578px_3.08257px_#9747FF]' : 'shadow-[0px_2.93578px_3.08257px_#A3FFEF]'}`}
        ></div>
      </motion.div>
    </>
  )
}

export default BtnVoice
