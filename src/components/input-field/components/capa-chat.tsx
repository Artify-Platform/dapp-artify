import Image from 'next/image'

const CapaChat = ({ heightSeparator }: { heightSeparator: number }) => {
  return (
    <>
      <div className='items-center p-0 flex h-9 w-[112px] md:w-[121px] flex-row'>
        <div className='flex h-9 w-[113px] flex-row items-center gap-4 p-0'>
          <div className='flex h-9 w-9 flex-col items-center justify-end gap-[6px] rounded bg-[linear-gradient(0deg,rgba(255,255,255,0.05),rgba(255,255,255,0.05)),linear-gradient(180deg,#B6FFED_-24.61%,#E5B2FF_95.61%)] p-[6px]'>
            <Image
              src='/images/input-field/capa.svg'
              alt='capa.svg'
              width={19.69}
              height={19.69}
              className='h-[19.69px] w-[19.69px]'
            />
          </div>
          <p className='h-6 w-[61px] text-sm md:text-base font-medium text-[#9A9A9A] flex items-center'>/prompt</p>
        </div>
      </div>
      <div
        style={{ height: heightSeparator + 'px' }}
        className='self-center flex justify-center border border-[#9A9A9A]'
      ></div>
    </>
  )
}

export default CapaChat
