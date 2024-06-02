import Image from 'next/image'

const Avatar = ({ name, image }: { name: string; image: string }) => {
  return (
    <>
      <Image
        className='w-[24px] h-[24px] md:h-[32px] md:w-[32px] shrink-0 grow-0'
        src={image}
        width={32}
        height={32}
        alt='default'
      ></Image>
      <p className='text-default-color font-Poppins text-[16px] font-semibold not-italic leading-[normal]'>{name}</p>
    </>
  )
}

export default Avatar
