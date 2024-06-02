'use client'
import { useChat } from '@/provider/chat-provider'
import { useWrapper } from '@/provider/wrapper-provider'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import BtnVoice from '../btn-vocie'
import LevelSwitch from '../header/components/level'
import InputField from '../input-field'
import ModalCreate from '../modal-create'
import Intro from './components/intro'
import Message from './components/message'
import useScrollToBottom from './components/scroll-to-bottom'

const Chat = () => {
  const {
    messages,
    isStart,
    isGenerate,
    showFirstDiv,
    initChat,
    communicate,
    switchLevel,
    heightChatContent,
    setHeightChatContent,
    updateChatContentScroll,
    getHistoryChat,
  } = useChat()
  const { level } = useWrapper()
  const { current } = useScrollToBottom(messages)
  const [documentHeight, setDocumentHeight] = useState(0)

  useEffect(() => {
    if (isStart && messages.length === 0) {
      initChat()
    }
  }, [initChat, isStart, messages])

  useEffect(() => {
    communicate()
    setDocumentHeight(window.innerHeight)
    updateChatContentScroll()
  }, [communicate, messages, updateChatContentScroll])

  useEffect(() => {
    switchLevel()
  }, [level, switchLevel])

  useEffect(() => {
    setHeightChatContent(heightChatContent)
    setDocumentHeight(window.innerHeight)
  }, [heightChatContent, setHeightChatContent])

  return (
    <>
      <BtnVoice />
      <div className='flex flex-col-reverse items-center w-full flex-1 justify-between gap-4'>
        <div className='w-full flex flex-1 md:flex-none flex-col items-center justify-center md:mb-8'>
          <div className='hidden md:block md:fixed md:bottom-[20px]' id='desktop-prompt'>
            <InputField />
          </div>
        </div>
        <div
          className='w-full flex flex-none relative overflow-auto justify-end items-end'
          style={{ scrollbarWidth: 'none' }}
        >
          <div className='flex flex-col-reverse items-center w-full h-full relative'>
            {messages.length === 0 && (
              <motion.div
                animate={{ opacity: showFirstDiv ? 1 : 0 }}
                transition={{ duration: 1 }}
                style={{
                  bottom: heightChatContent + 'px',
                }}
                className='mx-auto py-[10px] fixed md:!top-[50%] md:!translate-y-[-50%] flex max-w-[800px] w-full flex-1 flex-col items-start justify-end md:justify-center'
              >
                <Intro showFirstDiv={showFirstDiv}></Intro>
              </motion.div>
            )}
            <>
              <div
                ref={current}
                id='scrollableDiv'
                className='w-full items-center z-[5] h-full md:pt-10'
                style={{
                  height: `calc(${documentHeight}px - ${heightChatContent}px)`,
                  overflow: 'auto',
                  display: 'flex',
                  flexDirection: 'column-reverse',
                  scrollbarWidth: 'none',
                }}
              >
                <InfiniteScroll
                  dataLength={messages.length}
                  next={() => {}}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    maxWidth: '800px',
                    overflow: 'hidden',
                  }}
                  inverse={true}
                  hasMore={true}
                  loader={<></>}
                  scrollableTarget='scrollableDiv'
                  className=' gap-8'
                >
                  <div className='h-[52px] md:h-[60px]'></div>
                  {messages.map((message, index) => (
                    <Message key={index} message={message} index={index} />
                  ))}
                  <div></div>
                </InfiniteScroll>
              </div>
              <div>{isGenerate ? <ModalCreate /> : <></>}</div>
            </>
          </div>
        </div>
      </div>
      <div className='fixed bottom-0 w-full md:hidden z-[7] mt-8' id='mobile-bottom'>
        <div className='pb-9 pt-2 px-4' id='mobile-prompt'>
          <InputField />
        </div>

        <div className='relative px-4 mt-2 w-full bg-[linear-gradient(180deg,rgba(255,255,255,0.10)_-13.3%,rgba(240,254,255,0.20)_11.46%,#E0FDFF_41.29%,#CBD9FF_61.7%)]'>
          <LevelSwitch />
          <div className='flex h-[22px] justify-center items-center px-[124px]'>
            <div className='w-[134px] h-[5px] bg-[#000] rounded-[100px]'></div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Chat
