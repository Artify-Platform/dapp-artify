'use client'

import useZkLogin from '@/hooks/use-zkLogin'
import { useChat } from '@/provider/chat-provider'
import { useSuiWallet } from '@/provider/sui-provider'
import { useWrapper } from '@/provider/wrapper-provider'
import { formattedAddress, loadAccountZKLogin } from '@/utils'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import config from '../../../config.json'
import ModalOptionsLogin from './components/modal-options-login'

export const stateConnect = {
  connect: 'Connect Wallet',
  connecting: 'Connecting',
}

const BtnConnectWallet = () => {
  const wallet = useSuiWallet()
  const { completeZkLogin } = useZkLogin()
  const { setIsAuthenticated, isAuthenticated, setIsShowBlank } = useWrapper()
  const { deleteHistoryChat } = useChat()
  const [accountAddress, setAccountAddress] = useState(stateConnect.connect)
  const [showOptions, setShowOptions] = useState(false)
  const [showModalSUI, setShowModalSUI] = useState(false)
  const account = loadAccountZKLogin()

  useEffect(() => {
    if (wallet.connected) {
      localStorage.setItem('loginStatus', 'success')
      setAccountAddress(formattedAddress(wallet.address!))
      setIsAuthenticated(true)
      setShowModalSUI(false)
      setShowOptions(false)
      deleteHistoryChat()
      return
    }

    if (account) {
      setAccountAddress(formattedAddress(account.userAddr))
      setIsAuthenticated(true)
      deleteHistoryChat()
      return
    }

    if (accountAddress && accountAddress !== stateConnect.connect) {
      setAccountAddress(accountAddress)
      setIsAuthenticated(true)
      deleteHistoryChat()
      return
    }

    setAccountAddress(accountAddress)
  }, [accountAddress, account, setIsAuthenticated, wallet, deleteHistoryChat])

  useEffect(() => {
    wallet.connected
      ? setAccountAddress(formattedAddress(wallet.address!))
      : completeZkLogin({ setAccountAddress, setIsAuthenticated, setIsShowBlank })
  }, [completeZkLogin, setIsAuthenticated, setIsShowBlank, wallet])

  const handleClick = () => {
    localStorage.removeItem(config.ACCOUNT_DATA_KEY)
    localStorage.removeItem('loginStatus')
    setIsAuthenticated(false)

    if (wallet.connected) {
      wallet.disconnect()
      setAccountAddress(stateConnect.connect)
      return
    }

    if (accountAddress && accountAddress !== stateConnect.connect) {
      setAccountAddress(stateConnect.connect)
      return
    }
    setShowOptions(true)
  }

  return (
    <>
      {showOptions && !isAuthenticated && (
        <ModalOptionsLogin setShow={setShowOptions} showModalSUI={showModalSUI} setShowModalSUI={setShowModalSUI} />
      )}

      <div className='w-auto h-auto md:w-[183px] md:h-11 flex justify-center items-center'>
        <button
          id='button-connect'
          onClick={() => handleClick()}
          className='flex w-full h-full flex-row items-center justify-evenly gap-2 rounded-[100px] bg-[#FFFFFF] px-4 py-2 md:px-6 md:py-[10px] text-sm md:text-base text-[#3B3B3B] backdrop-blur-custom'
        >
          {accountAddress === 'Connect Wallet' ? (
            'Connect Wallet'
          ) : (
            <>
              {accountAddress}
              <Image
                src='/images/btn-connect-wallet/chevron-down.svg'
                width={16}
                height={16}
                alt='chevron-down.png'
                className='w-4 h-4'
              />
            </>
          )}
        </button>
      </div>
    </>
  )
}

export default BtnConnectWallet
