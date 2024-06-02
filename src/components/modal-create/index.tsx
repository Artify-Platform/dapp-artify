'use client'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import CircularProgressBar from './components/circular-progress-bar'

const ModalCreate = () => {
  const [show, setShow] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!show) return

    const interval = setInterval(() => {
      if (progress < 99) {
        setProgress((prevProgress) => prevProgress + 1)
      }
    }, 70)

    return () => clearInterval(interval)
  }, [progress, show])

  return (
    <>
      {show && (
        <div className='fixed inset-0 z-10 flex justify-center px-4 md:p-0'>
          <div className='absolute inset-0 bg-[rgba(244,244,244,0.30)] backdrop-blur-custom '></div>
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 120 },
              visible: { opacity: 1, y: 0, transition: { delayChildren: 1.5, staggerChildren: 1 } },
            }}
            initial='hidden'
            whileInView='visible'
            className='w-[382px] h-[316px] rounded-3xl gap-8 flex flex-col items-center p-10 bg-[#FFFFFF] m-auto z-20'
          >
            <h2 className='font-semibold text-sm md:text-base text-center text-[#3B3B3B]'>
              Hang in there! Big tasks take a little time. Thanks for your patience!
            </h2>
            <div>
              <CircularProgressBar sqSize={100} strokeWidth={6} percentage={progress} />
            </div>
            {progress < 100 && <p className='text-base font-semibold text-center text-[#73C4FF]'>Creating...</p>}
          </motion.div>
        </div>
      )}
    </>
  )
}

export default ModalCreate
