import { MessageTypeEnum } from '@/contants/enum'
import { useChat } from '@/provider/chat-provider'
import { useWrapper } from '@/provider/wrapper-provider'
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import CapaChat from './capa-chat'
import Tag from './tag'

export type TagType = {
  text: string
  backgroundColor: string
  textColor: string
}

const bgColors = ['#60DDD64D', '#FF73F14D', '#A358FF4D', '#73C4FF4D', '#FFD0584D']
const textColors = ['#60DDD6', '#FF73F1', '#A358FF', '#73C4FF', '#FFD058']

const Tags = ({ setHeightSeparator }: { setHeightSeparator: Dispatch<SetStateAction<number>> }) => {
  const { level } = useWrapper()
  const { prompts, messages, setHeightChatContent, updateChatContentScroll } = useChat()
  const [promptTags, setPromptTags] = useState(new Map())
  const refTags = useRef<HTMLDivElement>(null)

  useEffect(() => {
    updateChatContentScroll()
  }, [promptTags, promptTags.size, updateChatContentScroll])

  useEffect(() => {
    if (
      (messages[messages.length - 1]?.type &&
        (messages[messages.length - 1]?.type == MessageTypeEnum.IMAGE ||
          messages[messages.length - 1]?.type === MessageTypeEnum.CHOOSE_IMG ||
          (messages[messages.length - 2]?.type === MessageTypeEnum.CHOOSE_IMG &&
            messages[messages.length - 1].type === MessageTypeEnum.USER) ||
          (messages[messages.length - 3]?.type === MessageTypeEnum.CHOOSE_IMG &&
            messages[messages.length - 1].type === MessageTypeEnum.TYPING) ||
          messages[messages.length - 1]?.type === MessageTypeEnum.COMPLETED)) ||
      (prompts.options.length === 0 && prompts.text.length === 0)
    ) {
      promptTags.clear()
      setPromptTags(promptTags)
      setHeightSeparator(20)
      return
    }

    for (const prompt of prompts.options) {
      if (!promptTags.has(prompt)) {
        for (let i = 0; i < messages.length; i++) {
          if (messages[i].options.includes(prompt)) {
            const index = messages[i].activeOption

            if (index !== -1) {
              promptTags.set(prompt, {
                text: prompt,
                backgroundColor: bgColors[index],
                textColor: textColors[index],
              })
              setPromptTags(promptTags)
            }
          }
        }
      }
    }

    for (const prompt of prompts.text) {
      if (!promptTags.has(prompt)) {
        const randomIndex = Math.floor(Math.random() * bgColors.length)

        const randomBackgroundColor = bgColors[randomIndex]
        const randomTextColor = textColors[randomIndex]
        promptTags.set(prompt, {
          text: prompt,
          backgroundColor: randomBackgroundColor,
          textColor: randomTextColor,
        })
        setPromptTags(promptTags)
      }
    }

    const height = document.getElementById('tags')?.clientHeight
    if (height && height > 40) {
      setHeightSeparator(height)
    }
  }, [promptTags, prompts, setHeightSeparator, messages, level])

  return (
    <>
      <div ref={refTags} className='flex items-center p-0 gap-3 flex-wrap' id='tags'>
        <div className='flex self-start md:hidden'>
          <CapaChat heightSeparator={20} />
        </div>
        {promptTags.size > 0 &&
          [...promptTags].map(([tag, value]) => (
            <Tag key={tag} text={value.text} backgroundColor={value.backgroundColor} textColor={value.textColor} />
          ))}
      </div>
    </>
  )
}

export default Tags
