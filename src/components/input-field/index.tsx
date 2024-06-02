'use client'
import { useChat } from '@/provider/chat-provider'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import CapaChat from './components/capa-chat'
import Tags from './components/tags'

const InputField = () => {
  const [heightSeparator, setHeightSeparator] = useState(20)
  const { isStart } = useChat()

  useEffect(() => {
    setHeightSeparator(heightSeparator)
  }, [heightSeparator])

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 120 },
        visible: { opacity: 1, y: 0, transition: { delayChildren: 1.5, staggerChildren: 1 } },
      }}
      initial='hidden'
      animate='visible'
      // className='relative md:fixed md:bottom-[2%] md:left-[calc(50%_-_800px/2)] '
      className='relative'
    >
      {isStart ? (
        <div className='flex w-full max-w-[800px] flex-col items-start justify-center gap-4 rounded-[14px]  px-3 py-[10px] bg-[#24262C]'>
          <div className='flex w-full md:w-[776px] flex-row items-center gap-3 p-0'>
            <div className='hidden md:flex self-start'>
              <CapaChat heightSeparator={heightSeparator} />
            </div>
            <div>
              <Tags setHeightSeparator={setHeightSeparator} />
            </div>
          </div>
        </div>
      ) : (
        <p className='block p-4 text-center text-base md:text-xl h-[56px] font-semibold tracking-[1px] text-[rgba(0,0,0,0.6)]'>
          Tap & say something to start
        </p>
      )}
    </motion.div>
  )
}

export default InputField
