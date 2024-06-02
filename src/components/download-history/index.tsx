import { useWrapper } from '@/provider/wrapper-provider'
import { loadAccountZKLogin } from '@/utils'
import { getImageInformation, getOwnedObject } from '@/utils/nft'
import { useWallet } from '@suiet/wallet-kit'
import { motion } from 'framer-motion'
import moment from 'moment'
import { useEffect, useState } from 'react'
import ImageHistory from './components/image-history'

export type NFTHistoryType = {
  id: string
  name: string
  path: string
  createAt: string
  size: string
}

const DownloadHistory = ({ showHistory }: { showHistory: boolean }) => {
  const wallet = useWallet()
  const { isAuthenticated, isMinted } = useWrapper()
  const [nftHistory, setNftHistory] = useState<NFTHistoryType[]>([])

  useEffect(() => {
    const fetchData = async () => {
      let objectData = null
      const accountZKLogin = loadAccountZKLogin()
      if (accountZKLogin) objectData = await getOwnedObject(accountZKLogin.userAddr)
      else {
        objectData = await getOwnedObject(wallet.address!)
      }

      if (objectData && Array.isArray(objectData.data)) {
        const promise = objectData!.data.map(async (obj) => {
          const image = await getImageInformation(obj.data?.display?.data?.image_url || '')
          const createAt = image?.createAt || ''

          const size = image?.size || ''
          const nft = {
            id: obj.data?.objectId || '',
            name: obj.data?.display?.data?.name || '',
            path: obj.data?.display?.data?.image_url || '',
            createAt: createAt,
            size: size,
          }
          return nft
        })

        const history = await Promise.all(promise)
        const filterHistory = history.filter(
          (his) => !isNaN(new Date(his.createAt).getTime()) && his.path && his.name !== 'name'
        )

        filterHistory.sort((a, b) => {
          const dateA = new Date(a.createAt).getTime()
          const dateB = new Date(b.createAt).getTime()

          return dateB - dateA
        })
        setNftHistory([...filterHistory])
      }
    }

    fetchData()
  }, [isAuthenticated, isMinted, wallet])

  return (
    showHistory && (
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        style={{
          transformOrigin: 'calc(100% /2) top',
        }}
        className='!translate-x-[50%] absolute min-w-[346px] max-w-[361px] h-[470px] flex flex-col pl-5 pr-[10px] py-4 gap-2 isolate top-[50px] md:top-[77px] right-[50%] bg-[rgba(255,255,255,0.5)] backdrop-blur-custom rounded-2xl z-[9]'
      >
        <h2 className='font-semibold text-xl leading-9 text-[#3B3B3B] w-full '>My Assets</h2>
        {nftHistory && nftHistory.length > 0 ? (
          <div className='flex flex-col gap-2 flex-1 overflow-y-auto w-max scrollbar-thin scrollbar-webkit pr-[10px] rounded-lg'>
            {nftHistory.map((image) => (
              <ImageHistory
                key={'image-download-history-' + image.id}
                id={image.id}
                name={image.name}
                path={image.path || '/images/header/logo.svg'}
                size={image.size}
                createAt={moment(new Date(image.createAt)).format('DD/MM/YYYY h:mm A')}
              />
            ))}
          </div>
        ) : (
          <div className='w-full flex-1 flex items-center justify-center text-center text-sm text-[rgba(0,0,0,0.6)] font-semibold'>
            No NFTs
          </div>
        )}
      </motion.div>
    )
  )
}

export default DownloadHistory
