import { MessageTypeEnum } from '@/contants/enum'
import useMint from '@/hooks/useMint'

import { loadAccountZKLogin } from '@/utils'
// import { ConnectButton } from '@suiet/wallet-kit'
import { useChat } from '@/provider/chat-provider'
import { useWrapper } from '@/provider/wrapper-provider'

import { IMessage } from '@/types/messages'
import { setFaucet } from '@/utils/nft'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useCallback, useEffect } from 'react'
import { toast } from 'react-toastify'
import Avatar from './avatar'
import Option from './option'

const boxShadow = [
  '0px -2px 4px 0px #AFF3E3 inset, 0px 4px 8px 0px #B6FFED',
  '0px -2px 4px 0px #E0C6FF inset, 0px 4px 8px 0px #E0C6FF',
  '0px -2px 4px 0px #CBD9FF inset, 0px 4px 8px 0px #ABE6FF',
  '0px -2px 4px 0px #AFF3E3 inset, 0px 4px 8px 0px #B6FFED',
  '0px -2px 4px 0px #F9E5B2 inset, 0px 4px 8px 0px #FFEEC2',
]
const activeBackground = ['#60DDD6', '#FF73F1', '#A358FF', '#73C4FF', '#FFD058']
const optionTextColor = ['#60DDD6', '#FF73F1', '#A358FF', '#73C4FF', '#FFD058']

const Message = ({ message, index }: { message: IMessage; index: number }) => {
  const { isAuthenticated } = useWrapper()
  const { isCompleted, prompts, isError, error } = useChat()
  const { onMintZKLogin, onMintWallet } = useMint()
  const scrollableDiv = document.getElementById('scrollableDiv') as HTMLElement
  const scrollTop = scrollableDiv?.scrollTop
  const delay = scrollTop < -300 ? 0.2 : 0.3

  const handleMint = useCallback(async () => {
    if (isCompleted && isAuthenticated && message && message.type === 'completed') {
      const imageUrl = message.image ? message.image.toString() : ''

      const description = [...prompts.options, ...prompts.text]
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(',')

      const accountZKLogin = loadAccountZKLogin()

      if (accountZKLogin) {
        await setFaucet()
        await onMintZKLogin({
          account: accountZKLogin,
          name: 'Minted NFT',
          description: description,
          image: imageUrl,
        })
      } else {
        await onMintWallet({
          name: 'Minted NFT',
          description: description,
          image: imageUrl,
        })
      }
    }
  }, [isAuthenticated, isCompleted, message, prompts, onMintWallet, onMintZKLogin])

  const handleRetry = () => {
    if (!isAuthenticated) {
      toast.error('Please connect wallet before retry')
      return
    }

    handleMint()
  }

  useEffect(() => {
    handleMint()
  }, [handleMint])

  return (
    <motion.div
      initial='hidden'
      whileInView='visible'
      viewport={{ once: true }}
      variants={{
        visible: {
          opacity: 1,
          height: 'auto',
          transition: { ease: 'linear', duration: 0.2, delay: scrollTop == 0 ? 0 : delay },
        },
        hidden: { opacity: 0, height: 0 },
      }}
      className='gap-4 message px-4 md:px-0 '
    >
      <div className='flex items-center gap-2 md:gap-3'>
        <Avatar name={message?.name} image={message?.avatar} />
      </div>
      <div className='flex flex-col gap-4 pl-8 md:pl-11'>
        {(message?.type === MessageTypeEnum.TYPING || message?.type === MessageTypeEnum.COMPLETED) && error === '' && (
          <div className='wavy'>
            <span style={{ '--i': 1 } as React.CSSProperties}></span>
            <span style={{ '--i': 2 } as React.CSSProperties}></span>
            <span style={{ '--i': 3 } as React.CSSProperties}></span>
          </div>
        )}
        {message?.type !== MessageTypeEnum.TYPING && message?.type !== MessageTypeEnum.COMPLETED && (
          <p
            className={`xs:text-base leadign-[32px] font-SFProDisplay ${index == 0 ? 'md:text-[32px]' : 'md:text-[20px]'} font-normal not-italic text-primary`}
            dangerouslySetInnerHTML={{ __html: message?.message }}
          ></p>
        )}

        {message?.images && message?.images.length > 0 && message?.type === MessageTypeEnum.IMAGE && (
          <div className='flex w-[80%] md:w-full h-auto flex-wrap md:h-[204px] gap-2'>
            {message?.images.map((image, index) => (
              <div
                key={index}
                className='backdrop relative flex flex-col px-[10px] pt-[10px] pb-[5px] md:px-4 md:pt-4 md:pb-2 rounded-lg gap-2 w-auto md:w-[172px] bg-[linear-gradient(144.42deg,#FFFFFF_0%,#D9EEFF_49.61%,#FFFFFF_100%)] shadow-[0px_3px_20px_0px_#00000040]'
              >
                <Image
                  src={image}
                  width={140}
                  height={140}
                  alt='default'
                  className='rounded-lg h-[82px] w-[82px] md:w-[140px] md:h-[140px] drop-shadow-[-2px_3px_0px_#4BB9EC,2px_3px_0px_#4BB9EC,-1px_3px_0px_#4BB9EC]'
                ></Image>
                <div className='text-[#3B3B3B] font-bold text-[10px] md:text-base text-center mt-auto'>
                  #{index + 1}
                </div>
              </div>
            ))}
          </div>
        )}

        {message?.image && message?.type === MessageTypeEnum.COMPLETED && !isError && error === 'success' && (
          <>
            <div className='flex w-fit md:w-[247px] md:h-[302px] mt-4'>
              <div
                key={index}
                className='backdrop relative flex-1 flex flex-col px-[15px] pt-[15px] pb-[7px] md:px-5 md:pt-5 md:pb-4 rounded-lg gap-[14px] md:gap-6 w-fit md:w-[172px] bg-[linear-gradient(144.42deg,#FFFFFF_0%,#D9EEFF_49.61%,#FFFFFF_100%)] shadow-[0px_3px_20px_0px_#00000040]'
              >
                <Image
                  src={message?.image.toString()}
                  width={140}
                  height={140}
                  alt='default'
                  className='rounded-lg w-[123px] h-[123px] md:w-auto md:h-auto drop-shadow-[-2px_3px_0px_#4BB9EC,2px_3px_0px_#4BB9EC,-1px_3px_0px_#4BB9EC]'
                ></Image>
                <div className='text-[#3B3B3B] font-bold text-sm md:text-2xl text-center mt-auto'>#{message.index}</div>
              </div>
            </div>
            <div className='flex justify-start gap-1 items-center'>
              <Image
                src='/images/chat/done.gif'
                alt='done.gif'
                className='object-cover w-[28px] h-[28px] md:w-[32px] md:h-[32px]'
                width={32}
                height={32}
              />
              <p className='md:text-xl text-[#3B3B3B]'>Minted. Please check your assets</p>
            </div>
          </>
        )}
        {message?.image && message?.type === MessageTypeEnum.COMPLETED && isError && error !== '' && (
          <>
            <p className='leadign-[32px] font-SFProDisplay text-base md:text-[20px] font-normal not-italic text-primary'>
              Oops! {error}
            </p>
            <button
              onClick={() => handleRetry()}
              className='rounded-lg font-medium text-base md:text-lg text-[#fff] bg-[#0080FF] py-1 px-5 w-fit'
            >
              Retry
            </button>
          </>
        )}
        {message?.options?.length > 0 &&
          message?.type != MessageTypeEnum.CHOOSE_IMG &&
          message?.type !== MessageTypeEnum.IMAGE && (
            <div className='flex items-start gap-2 flex-wrap md:gap-4'>
              {message?.options.map((option, index) => (
                <Option
                  key={index}
                  boxShadow={boxShadow[index]}
                  content={option}
                  textColor={message.activeOption == index ? '#FFF' : optionTextColor[index]}
                  backgroundColor={message.activeOption == index ? activeBackground[index] : '#FFF'}
                  className='w-auto'
                ></Option>
              ))}
            </div>
          )}
        {message?.options?.length > 0 && message?.type === MessageTypeEnum.CHOOSE_IMG && (
          <div className='flex items-start gap-4 flex-wrap w-full md:w-[460px]'>
            {message?.options.map((option, index) => (
              <Option
                key={index}
                boxShadow={boxShadow[index]}
                content={option}
                textColor={message.activeOption == index ? '#FFF' : optionTextColor[index]}
                backgroundColor={message.activeOption == index ? activeBackground[index] : '#FFF'}
                className='w-[45%] md:w-[178px]'
              ></Option>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default Message
