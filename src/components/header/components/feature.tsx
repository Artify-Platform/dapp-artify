'use client'
import DownloadHistory from '@/components/download-history'
import { useWrapper } from '@/provider/wrapper-provider'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import BtnConnectWallet from '../../btn-connect-wallet'
const Feature = () => {
  const { isAuthenticated, isMinted, setIsMinted, level } = useWrapper()
  const [showHistory, setShowHistory] = useState(false)

  const handleSelectHistory = () => {
    if (isMinted) setIsMinted(false)
    setShowHistory(!showHistory)
  }

  useEffect(() => {
    setShowHistory(false)
  }, [level])

  return (
    <div className='flex items-center gap-3 md:gap-4'>
      <div className='w-9 h-9 md:h-11 md:w-11 relative'>
        {isAuthenticated && (
          <>
            <div className='relative w-full h-full rounded-full bg-white flex justify-center items-center'>
              <Image
                onClick={() => handleSelectHistory()}
                src='/images/header/chat-icon.svg'
                width={24}
                height={24}
                alt='default'
                className='cursor-pointer h-4 w-4 md:h-6 md:w-6'
              ></Image>
              {isMinted && <div className='absolute w-2 h-2 rounded-full bg-[#E90C0C] left-[3.91px] top-0'></div>}
            </div>
            <DownloadHistory showHistory={showHistory} />
          </>
        )}
      </div>
      <BtnConnectWallet />
    </div>
  )
}

export default Feature
