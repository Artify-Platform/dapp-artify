import { useChat } from '@/provider/chat-provider'
import { useWrapper } from '@/provider/wrapper-provider'
import Image from 'next/image'
import { useEffect, useState } from 'react'
const LevelSwitch = () => {
  const { level, setLevel } = useWrapper()
  const { deleteHistoryChat, setPrompts } = useChat()
  const [selectedButton, setSelectedButton] = useState(level)

  useEffect(() => {
    setSelectedButton(level)
  }, [level])

  const handleButtonClick = (button: number) => {
    setSelectedButton(button)
    setLevel(button)
    deleteHistoryChat()
    setPrompts({
      options: [],
      text: [],
    })
  }
  return (
    <div className='flex items-center justify-between md:justify-center gap-[88px] md:gap-1 rounded-[100px] border !border-[#FFF] bg-[rgba(254,_254,_254,_0.40)] p-2 backdrop-blur-custom'>
      <button
        className={`w-[139px] flex justify-center rounded-[100px] py-2 pl-4 pr-5 gap-2 hover:shadow-[0px_4px_20px_0px_rgba(16,_148,_221,_0.36)] ${selectedButton === 0 ? 'bg-[#FEFEFE] shadow-[0px_4px_20px_0px_rgba(16,_148,_221,_0.36)]' : ''}`}
        onClick={() => handleButtonClick(0)}
      >
        <Image src='/images/header/newbie-icon.svg' width={24} height={24} alt='newbie'></Image>
        <p
          className={`font-SFProDisplay text-sm md:text-[20px] font-medium not-italic leading-[24px] ${selectedButton === 0 ? 'text-[#3B3B3B]' : 'text-[rgba(59,_59,_59,_0.20)]'}`}
        >
          Newbie
        </p>
      </button>
      <button
        className={`w-[139px] flex justify-center rounded-[100px] py-2 pl-4 pr-5 gap-2 hover:shadow-[0px_4px_20px_0px_rgba(16,_148,_221,_0.36)] ${selectedButton === 1 ? 'bg-[#FEFEFE] shadow-[0px_4px_20px_0px_rgba(16,_148,_221,_0.36)]' : ''}`}
        onClick={() => handleButtonClick(1)}
      >
        <Image src='/images/header/expert-icon.svg' width={24} height={24} alt='expert'></Image>
        <p
          className={`font-SFProDisplay text-sm md:text-[20px] font-medium not-italic leading-[24px] ${selectedButton === 1 ? 'text-[#3B3B3B]' : 'text-[rgba(59,_59,_59,_0.20)]'}`}
        >
          Expert
        </p>
      </button>
    </div>
  )
}
export default LevelSwitch
