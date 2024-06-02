import useZkLogin from '@/hooks/use-zkLogin'
import { OpenIdProvider } from '@/types/AccountData'
import { ConnectModal } from '@suiet/wallet-kit'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Dispatch, SetStateAction, useCallback } from 'react'

type ModalOptionsLoginType = {
  showModalSUI: boolean
  setShow: Dispatch<SetStateAction<boolean>>
  setShowModalSUI: Dispatch<SetStateAction<boolean>>
}
const openIdProviders: OpenIdProvider[] = ['Google', 'Twitch']

const ModalOptionsLogin = ({ setShow, setShowModalSUI, showModalSUI }: ModalOptionsLoginType) => {
  const { beginZkLogin } = useZkLogin()
  const handleOffModal = useCallback(() => {
    setShow(false)
  }, [setShow])

  return (
    <div className='fixed inset-0 z-10 flex px-4 md:p-0'>
      <div
        onClick={() => handleOffModal()}
        className='absolute inset-0 bg-[rgba(244,244,244,0.30)] backdrop-blur-custom'
      ></div>
      {showModalSUI ? (
        <motion.div
          key={1}
          variants={{
            hidden: { opacity: 0, y: 120 },
            visible: { opacity: 1, y: 0, transition: { delayChildren: 1.5, staggerChildren: 1 } },
          }}
          initial='hidden'
          animate='visible'
        >
          <ConnectModal open={showModalSUI} onOpenChange={(open) => setShowModalSUI(open)} />
        </motion.div>
      ) : (
        <motion.div
          key={2}
          variants={{
            hidden: { opacity: 0, y: 120 },
            visible: { opacity: 1, y: 0, transition: { delayChildren: 1.5, staggerChildren: 1 } },
          }}
          initial='hidden'
          whileInView='visible'
          className='w-[382px] h-[316px] rounded-3xl gap-5 flex flex-col items-center p-10 bg-[#FFFFFF] m-auto z-20 '
        >
          <div className=' font-semibold text-lg text-right cursor-pointer w-full'>
            <span className='p-2 rounded-xl text-[#3B3B3B]' onClick={() => handleOffModal()}>
              &#x2715;
            </span>
          </div>
          <h2 className='font-semibold text-lg text-center capitalize text-[#3B3B3B]'>
            Sign in with <br /> your preferred service
          </h2>

          <div className='w-full flex justify-center gap-4 z-[1000]'>
            {openIdProviders.map((provider) => (
              <button
                className='rounded-xl p-4 bg-[#EDF5FF]'
                onClick={() => {
                  beginZkLogin(provider)
                }}
                key={provider}
              >
                <Image
                  src={`/images/btn-connect-wallet/${provider.toLowerCase()}.png`}
                  alt={provider}
                  width={32}
                  height={32}
                  className='w-8 h-8'
                />
              </button>
            ))}

            <button
              className='rounded-xl p-4 bg-[#EDF5FF]'
              onClick={() => {
                setShowModalSUI(true)
              }}
            >
              <Image
                src={`/images/btn-connect-wallet/sui.png`}
                alt='SUI'
                width={32}
                height={32}
                className='w-10 h-10'
              />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default ModalOptionsLogin
