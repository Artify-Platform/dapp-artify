import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import Avatar from './avatar'
const Intro = ({ showFirstDiv }: { showFirstDiv: boolean }) => {
  const [key, setKey] = useState(0)

  // Reset animations whenever showFirstDiv changes
  useEffect(() => {
    if (showFirstDiv) {
      setKey((prevKey) => prevKey + 1)
    }
  }, [showFirstDiv])
  return (
    <div className='w-full px-4 py-[10px] md:px-0'>
      <div className='flex flex-col items-start md:gap-3' key={key}>
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0, y: showFirstDiv ? 0 : -30 }}
          transition={{ duration: showFirstDiv ? 0.5 : 1 }}
          className='flex items-center gap-2 md:gap-3'
        >
          <Avatar name={'Artify'} image={'/images/chat/artify-avatar.svg'} />
        </motion.div>
        <div className='pl-8 md:pl-11 text-base md:text-[36px]' key={key}>
          <motion.div
            // key={key}
            initial={{ y: 90, opacity: 0 }}
            animate={{ y: showFirstDiv ? 0 : -50, opacity: 1 }}
            transition={{ duration: showFirstDiv ? 0.5 : 1 }}
            className='flex gap-1'
          >
            <p className=' font-SFProDisplay font-bold not-italic md:leading-[44px] text-primary'>
              Welcome to{' '}
              <span className='bg-[linear-gradient(91deg,_#4DFAE4_25.15%,_#569DDA_40.4%,_#D52BFF_95.98%)] bg-clip-text font-SFProDisplay font-bold not-italic md:leading-[44p] text-transparent'>
                Artify
              </span>
            </p>
          </motion.div>
          <motion.div
            // key={key}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: showFirstDiv ? 0 : -60, opacity: 1 }}
            transition={{ duration: showFirstDiv ? 0.5 : 1 }}
          >
            <p className=' font-SFProDisplay font-bold not-italic md:leading-[44px] text-primary'>
              The First Voice to Digital NFTs in The World
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Intro
