import Image from 'next/image'
const Logo = () => {
  return (
    <div className='flex max-w-[229px] shrink-0 items-center gap-[9.029px]'>
      <Image src='/images/header/logo.svg' width={33.11} height={33.11} alt='logo' className='aspect-square'></Image>
      <h1 className='font-DrukTextWideTrial text-[22.572px] font-medium not-italic leading-[27.09px] text-[#3B3B3B]'>
        Artify
      </h1>
    </div>
  )
}

export default Logo
