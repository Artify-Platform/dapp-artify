import Image from 'next/image'
import Link from 'next/link'
import useDownloader from 'react-use-downloader'

type ImageHistoryProps = {
  id: string
  path: string
  name: string
  size: string
  createAt: string
}

const ImageHistory = ({ id, path, name, size, createAt }: ImageHistoryProps) => {
  const { download } = useDownloader()

  return (
    <div className='flex items-center p-2 gap-[30px] h-[92px] bg-[#FFFFFF] rounded-lg'>
      <div className='flex flex-row items-center p-0 gap-4 h-[76px] flex-1 justify-between'>
        <div className='w-[76px] h-[76px]'>
          <Image src={path} width={76} height={76} alt={name} className=' rounded object-cover w-full h-full' />
        </div>
        <div className='flex flex-col items-start p-0 flex-1'>
          <div className='flex flex-col items-start'>
            <Link
              href={'https://suiscan.xyz/devnet/object/' + id}
              target='_blank'
              className='text-sm md:text-xl font-medium text-[#3B3B3B]'
            >
              {name}
            </Link>
            <p className='font-normal text-sm leading-[24px] text-[#9A9A9A]'>{size}</p>
          </div>
          <p className='font-normal text-sm text-[#9A9A9A]'>{createAt}</p>
        </div>
      </div>
      <Image
        src='/images/download-history/download.svg'
        width={32}
        height={32}
        className='h-8 w-8 rounded-[200px] cursor-pointer'
        alt='download.svg'
        onClick={() => download(path, name + '.' + path.split('.').slice(-1))}
      />
    </div>
  )
}

export default ImageHistory
